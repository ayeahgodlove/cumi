/**
 * Image Compression Script
 * Compresses all images in the public directory using sharp
 * 
 * Usage: node scripts/compress-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const QUALITY = 80; // Quality for JPEG/WebP (0-100)

const COMPRESSION_OPTIONS = {
  jpeg: { quality: QUALITY, mozjpeg: true },
  png: { quality: QUALITY, compressionLevel: 9 },
  webp: { quality: QUALITY },
};

async function compressImage(inputPath, outputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      return { success: false, reason: 'Unsupported format' };
    }

    const originalSize = fs.statSync(inputPath).size;
    
    let sharpInstance = sharp(inputPath);
    
    // Apply compression based on file type
    if (ext === '.jpg' || ext === '.jpeg') {
      sharpInstance = sharpInstance.jpeg(COMPRESSION_OPTIONS.jpeg);
    } else if (ext === '.png') {
      sharpInstance = sharpInstance.png(COMPRESSION_OPTIONS.png);
    } else if (ext === '.webp') {
      sharpInstance = sharpInstance.webp(COMPRESSION_OPTIONS.webp);
    }

    await sharpInstance.toFile(outputPath);
    
    const compressedSize = fs.statSync(outputPath).size;
    const savedBytes = originalSize - compressedSize;
    const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

    return {
      success: true,
      originalSize,
      compressedSize,
      savedBytes,
      savedPercent,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function compressDirectory(dir) {
  const files = fs.readdirSync(dir);
  let totalOriginal = 0;
  let totalCompressed = 0;
  let filesProcessed = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const result = await compressDirectory(filePath);
      totalOriginal += result.totalOriginal;
      totalCompressed += result.totalCompressed;
      filesProcessed += result.filesProcessed;
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        const tempPath = filePath + '.tmp';
        const result = await compressImage(filePath, tempPath);

        if (result.success) {
          // Replace original with compressed
          try {
            fs.unlinkSync(filePath);
            fs.renameSync(tempPath, filePath);
            
            totalOriginal += result.originalSize;
            totalCompressed += result.compressedSize;
            filesProcessed++;
            
            console.log(`✅ ${file}: ${result.savedPercent}% smaller (${(result.savedBytes / 1024).toFixed(1)} KB saved)`);
          } catch (unlinkError) {
            console.log(`⚠️  ${file}: Skipped (file in use)`);
            if (fs.existsSync(tempPath)) {
              try { fs.unlinkSync(tempPath); } catch (e) { /* ignore */ }
            }
            // Still count it for stats even though we couldn't replace it
            totalOriginal += result.originalSize;
            totalCompressed += result.originalSize; // No savings for skipped file
          }
        } else if (fs.existsSync(tempPath)) {
          try { fs.unlinkSync(tempPath); } catch (e) { /* ignore */ }
        }
      }
    }
  }

  return { totalOriginal, totalCompressed, filesProcessed };
}

async function main() {
  console.log('\n🔧 Image Compression Started...\n');
  
  // Check if sharp is installed
  try {
    require('sharp');
  } catch (error) {
    console.error('❌ Sharp not installed!');
    console.log('\n💡 Install it with: npm install --save-dev sharp\n');
    process.exit(1);
  }

  const result = await compressDirectory(PUBLIC_DIR);
  
  const savedMB = ((result.totalOriginal - result.totalCompressed) / 1024 / 1024).toFixed(2);
  const savedPercent = (((result.totalOriginal - result.totalCompressed) / result.totalOriginal) * 100).toFixed(1);

  console.log('\n📊 Compression Complete!');
  console.log(`   Files processed: ${result.filesProcessed}`);
  console.log(`   Original size: ${(result.totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Compressed size: ${(result.totalCompressed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Space saved: ${savedMB} MB (${savedPercent}%)\n`);
}

main().catch(console.error);

