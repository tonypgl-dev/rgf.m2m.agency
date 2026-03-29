import sharp from "sharp";

await sharp("public/og-landscape.png")
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .png({ quality: 85, compressionLevel: 9 })
  .toFile("public/og-landscape-opt.png");

console.log("Done");
