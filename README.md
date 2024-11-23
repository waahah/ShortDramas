# ShortDramas
短剧搜索

### require environment

- `node` 
- `Vite` 

### Built with

```bash
git clone https://github.com/waahah/ShortDramas.git
cd ShortDramas
npm install
```

### Start the development server

```powershell
npx vite
```

默认会在 http://localhost:5173 启动开发服务器，并自动加载项目。

### Package

```powershell
npx vite build
```

打包后的文件会输出到 `dist/` 目录。

### Local test

```powershell
npx serve dist
```

### Deploy Vercel

1. 登录 [Vercel](https://vercel.com/)。

2. 创建一个新项目。

3. 选择你存储代码的 Git 仓库（如 GitHub、GitLab 或 Bitbucket）。

4. 在项目的 **Build and Output Settings** 中，确保配置如下：

- **Framework Preset**: 选择 `Vite`。
- **Output Directory**: 填写 `dist`。

点击 **Deploy**，Vercel 会自动部署项目，几秒钟后会生成一个 URL，你可以用来访问项目。

#### Customize the deployment path

如果你需要部署到子路径，比如 `https://yourdomain.com/subpath`，需要在 `vite.config.js` 中配置 `base` 选项：

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/subpath/', // 替换为你的子路径
});

```

重新运行 `npm run build` 后再部署。
