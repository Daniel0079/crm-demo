# Vue 3 CRM 練習

面試用練習專案。資料是前端 mock，可部署到 GitHub Pages。

## 本機執行

```bat
npm install
npm run dev
```

## 帳號

| 帳號 | 密碼 | 說明 |
|------|------|------|
| staff1 | 1234 | 只看自己的客戶，可提出申請 |
| staff2 | 1234 | 同上 |
| boss | 1234 | 主管，看待審、核准／駁回 |

## 部署到 GitHub Pages

1. 把 `vite.config.ts` 的 `base` 改成你的 repo 名稱，例如 `/你的repo名稱/`。
2. 推到 GitHub。
3. Settings → Pages → Source 選 GitHub Actions。
4. 或本機建置後把 `dist` 推到 `gh-pages` 分支。

```bat
npm run build
```

建置結果在 `dist`。
