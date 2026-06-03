## 2026-05-22 内容增量导入

### 要运行的文件
- SQL 文件：
  [/Users/ouyowu/Documents/taifan/docs/supabase-increment-2026-05-22.sql](/Users/ouyowu/Documents/taifan/docs/supabase-increment-2026-05-22.sql)

### 这份增量会补什么
- 新增 `OPEN LABEL` 第二层人物：
  - `Ou`
  - `Road`
- 新增 `Channel 3` 个人线人物：
  - `Bow`
  - `Gulf`
- 新增 `Studio Wabi Sabi` 人物：
  - `Prem`
  - `Fluke`
- 新增对应活动、动态稿、以及活动和艺人的关联

### 最新已并入这份增量的活动批次
- `OPEN LABEL`
  - `OuRoad Bangkok Open Label Studio Day`
  - `OuRoad Taipei Open Label Night`
  - `OuRoad Kuala Lumpur Open Label Weekend`
  - `OuRoad Seoul Open Label Pair Day`
  - `Road Singapore Open Label Pop-up Day`
  - `Road Bangkok Open Label Fan Studio`
  - `Win Singapore Open Label Press Day`
  - `Win Jakarta Open Label Style Night`
  - `Win Manila Open Label Press Room`
- `Channel 3`
  - `Bow Shanghai Channel 3 Brand Talk`
  - `Bow Bangkok Channel 3 Cafe Day`
  - `Bow Hong Kong Channel 3 Beauty Talk`
  - `Gulf Bangkok Channel 3 Media Salon`
  - `Gulf Shenzhen Channel 3 Brand Forum`
  - `Gulf Chengdu Channel 3 Style Day`
- `Studio Wabi Sabi`
  - `Prem Taipei Wabi Sabi Weekend`
  - `Prem Hong Kong Wabi Sabi Fan Circle`
  - `Prem Seoul Wabi Sabi Weekend Circle`
  - `Fluke Seoul Wabi Sabi Archive Day`
  - `Fluke Taipei Wabi Sabi Archive Night`
  - `Earth Kuala Lumpur Wabi Sabi Media Day`
  - `Earth Tokyo Wabi Sabi Reading Day`
  - `Fluke Bangkok Wabi Sabi Capsule Night`
- `MEMINDY`
  - `FortPeat Bangkok MEMINDY House Day`
  - `FortPeat Manila MEMINDY Live Room`
  - `BossNoeul Hong Kong MEMINDY Fan Night`

### 在 Supabase 里怎么做
1. 打开你的 `taifan` Supabase 项目。
2. 进入 `SQL Editor`。
3. 新建一个查询窗口。
4. 把上面的 SQL 文件全部粘进去。
5. 点击运行。

### 导入后建议检查
1. [首页](https://www.taifan.club/)
2. [艺人库](https://www.taifan.club/artists)
3. [活动日历](https://www.taifan.club/calendar)
4. [动态页](https://www.taifan.club/news)

### 预期效果
- `OPEN LABEL / Channel 3 / Studio Wabi Sabi` 这些公司线不再只有单点人物
- 艺人库会出现更多人物入口
- 日历和动态页会多出对应活动与中文整理稿
