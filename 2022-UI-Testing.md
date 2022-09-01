# 前端质量提升方案

## 现状
开发写UT
测试写UI 自动化测试代码；


## 目标
- UT + Testing User Interactions
- test-driven development


## 提升质量方法
1. 静态检测；ESLint、TypeScript
2. 代码结构便于测试；模块化、纯函数；视图和Logic分离；试图负责渲染界面，Logic负责处理数据和副作用；
3. 单元测试；`JEST` `test-driven-development`
4. 集成测试；
5. 用户交互测试；


## 整体流转
1. 在TestHub录入测试用例
2. 开发过程中编写`UT`
3. 开发根据测试用例写交互测试`Testing User Interactions`
4. 提交代码触发Pipeline
5. 运行结果更新至TestHub
6. Trippal通知到Commiter


|     | 优点  | 缺点  | 使用场景 |
| --- | --- | --- | --- |
| UT  | 一般是基于函数，开发自测 | 需要MOCK | 确保功能的正确性 |
| Intergration Test |     |     |     |
| Component Test |     |     |     |
| Testing User Interactions | 可以测试交互和渲染；速度快； | 不能保证样式的正确性；需要开发根据测试用例写单测； | 代替`E2E` |
| Testing Rendered Output | 能防止页面被意外修改 | 大量的`Snapshot`文本难以理解；Snapshot 创建成功，只能说明代码执行成功，不能确保界面显示正确 | 它不关注你逻辑是否正确，而关注与检查是否存在意外的修改。适用于底层公用组件。 |
| E2E Tests | 基于真机进行操作 | 写单测慢，运行慢； | 下单、支付等核心流程 |
