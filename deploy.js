import { execSync } from 'child_process';
import { existsSync, rmSync, cpSync, readdirSync, statSync, copyFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 开始部署到 GitHub Pages...\n');

try {
  // 1. 构建项目
  console.log('📦 构建项目...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ 构建完成\n');

  // 2. 检查dist目录
  const distPath = join(process.cwd(), 'dist');
  if (!existsSync(distPath)) {
    throw new Error('dist 目录不存在，构建失败！');
  }

  // 3. 切换到gh-pages分支或创建它
  console.log('🌿 准备 gh-pages 分支...');
  try {
    execSync('git checkout gh-pages', { stdio: 'pipe' });
    console.log('✅ 已切换到 gh-pages 分支\n');
  } catch (error) {
    console.log('📝 创建 gh-pages 分支...');
    execSync('git checkout --orphan gh-pages', { stdio: 'pipe' });
    execSync('git rm -rf .', { stdio: 'pipe' });
    console.log('✅ gh-pages 分支已创建\n');
  }

  // 4. 复制dist内容到根目录
  console.log('📋 复制构建文件...');
  const files = ['index.html', 'assets'];
  files.forEach(file => {
    const src = join(distPath, file);
    const dest = join(process.cwd(), file);
    if (existsSync(src)) {
      if (existsSync(dest)) {
        rmSync(dest, { recursive: true, force: true });
      }
      cpSync(src, dest, { recursive: true });
    }
  });
  
  // 复制所有其他文件
  readdirSync(distPath).forEach(item => {
    const src = join(distPath, item);
    const dest = join(process.cwd(), item);
    if (!files.includes(item)) {
      if (existsSync(dest)) {
        rmSync(dest, { recursive: true, force: true });
      }
      if (statSync(src).isDirectory()) {
        cpSync(src, dest, { recursive: true });
      } else {
        copyFileSync(src, dest);
      }
    }
  });
  console.log('✅ 文件复制完成\n');

  // 5. 添加并提交
  console.log('💾 提交更改...');
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
  console.log('✅ 提交完成\n');

  // 6. 推送到GitHub
  console.log('📤 推送到 GitHub...');
  execSync('git push origin gh-pages --force', { stdio: 'inherit' });
  console.log('✅ 推送完成\n');

  // 7. 切换回main分支
  execSync('git checkout main', { stdio: 'pipe' });
  
  console.log('🎉 部署成功！');
  console.log('📍 访问地址: https://wwwangzhenyang421.github.io/gomoku/');
  console.log('\n⚠️  注意：GitHub Pages 可能需要几分钟才能更新');
  
} catch (error) {
  console.error('❌ 部署失败:', error.message);
  // 确保切换回main分支
  try {
    execSync('git checkout main', { stdio: 'pipe' });
  } catch (e) {}
  process.exit(1);
}

