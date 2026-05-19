## 泰饭网首批线上数据导入

### 要运行的文件
- SQL 文件：
  [/Users/ouyowu/Documents/泰国娱乐圈项目/docs/supabase-first-launch-seed.sql](/Users/ouyowu/Documents/泰国娱乐圈项目/docs/supabase-first-launch-seed.sql)

### 在 Supabase 里怎么做
1. 打开你的 `taifan-club` Supabase 项目。
2. 左侧进入 `SQL Editor`。
3. 新建一个查询窗口。
4. 打开上面的 SQL 文件，把全部内容复制进去。
5. 点击运行。

### 这份首发数据会做什么
- 补 `news_posts.review_status` 字段，确保前台和后台审核流能正常工作。
- 导入首批艺人。
- 导入 6 月到 10 月的活动。
- 导入首批已发布动态稿。
- 重建活动和艺人的关联表。

### 导入后你应该马上检查
1. 首页：
   [https://www.taifan.club/](https://www.taifan.club/)
2. 艺人库：
   [https://www.taifan.club/artists](https://www.taifan.club/artists)
3. 动态页：
   [https://www.taifan.club/news](https://www.taifan.club/news)
4. 健康检查：
   [https://www.taifan.club/api/health](https://www.taifan.club/api/health)

### 预期结果
- 首页不再是 `0`
- 艺人库会出现首批主追和扩展艺人
- 动态页会出现已发布内容
- 活动详情和艺人详情会开始串起来
