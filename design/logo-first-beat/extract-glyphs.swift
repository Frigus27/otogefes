import Foundation
import CoreText
import CoreGraphics

let base = URL(fileURLWithPath: CommandLine.arguments[1])
let output = CommandLine.arguments[2]
let required = Array("合肥第一音游祭")
var glyphs: [String: Any] = [:]
func fmt(_ n: CGFloat) -> String { String(format: "%.3f", Double(n)).replacingOccurrences(of: #"\.?0+$"#, with: "", options: .regularExpression) }
func record(_ char: Character, _ font: CTFont, _ key: String) -> Bool {
    var codes = Array(String(char).utf16)
    var ids = [CGGlyph](repeating: 0, count: codes.count)
    guard CTFontGetGlyphsForCharacters(font, &codes, &ids, codes.count), ids[0] != 0,
          let path = CTFontCreatePathForGlyph(font, ids[0], nil) else { return false }
    var d = ""
    path.applyWithBlock { p in
        let e = p.pointee
        func pair(_ i: Int) -> String { "\(fmt(e.points[i].x)) \(fmt(e.points[i].y))" }
        switch e.type {
        case .moveToPoint: d += "M" + pair(0)
        case .addLineToPoint: d += "L" + pair(0)
        case .addQuadCurveToPoint: d += "Q" + pair(0) + " " + pair(1)
        case .addCurveToPoint: d += "C" + pair(0) + " " + pair(1) + " " + pair(2)
        case .closeSubpath: d += "Z"
        @unknown default: break
        }
    }
    var advance = CGSize.zero
    CTFontGetAdvancesForGlyphs(font, .horizontal, &ids, &advance, 1)
    glyphs[key] = ["d": d, "advance": advance.width, "font": CTFontCopyPostScriptName(font) as String]
    return true
}
let files = try FileManager.default.contentsOfDirectory(at: base, includingPropertiesForKeys: nil).filter { $0.pathExtension == "woff2" }
for file in files {
    guard let descriptors = CTFontManagerCreateFontDescriptorsFromURL(file as CFURL) as? [CTFontDescriptor], let descriptor = descriptors.last else { continue }
    let font = CTFontCreateWithFontDescriptor(descriptor, 1000, nil)
    for char in required where glyphs["cn:\(char)"] == nil { _ = record(char, font, "cn:\(char)") }
    if required.allSatisfy({ glyphs["cn:\($0)"] != nil }) { break }
}
let root = base.deletingLastPathComponent().deletingLastPathComponent().deletingLastPathComponent()
for (family, relative) in [("mono", "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2"), ("sans", "@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2")] {
    let url = root.appendingPathComponent(relative)
    guard let descriptors = CTFontManagerCreateFontDescriptorsFromURL(url as CFURL) as? [CTFontDescriptor], let descriptor = descriptors.last else { fatalError("Missing font: \(relative)") }
    let font = CTFontCreateWithFontDescriptor(descriptor, 1000, nil)
    for code in 33...126 { if let scalar = UnicodeScalar(code) { let char = Character(scalar); _ = record(char, font, "\(family):\(char)") } }
}
let data = try JSONSerialization.data(withJSONObject: glyphs, options: [.sortedKeys])
try data.write(to: URL(fileURLWithPath: output))
for char in required { guard glyphs["cn:\(char)"] != nil else { fatalError("Missing glyph \(char)") } }
print("Exported \(glyphs.count) glyph outlines.")
