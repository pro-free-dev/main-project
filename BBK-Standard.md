#### Component Standard

- File Standard
  
  - 组件入口文件为小写的index.tsx
  - src下文件名皆为大写开头的大驼峰写法
- Partition Standard
  
  - 基础组件放在component-basic下
  - 业务组件放在component-business下
- README Standard
  
- Props Standard
  
  - 基础组件props使用自定义通用字段，eg: tiltle/subtitle
  - 业务组件的次级组件/原子组件props使用自定义通用字段，业务组件的最终组装组件props使用契约字段
  - 点击事件使用onPressXxxx小驼峰写法
  - 回调使用onXxxx小驼峰写法
  - 控制元素展示与否使用isShowXxxx小驼峰写法
- Log Standard
  
- Modal Standard
  
  - 通过ref包装成非受控组件，使用ref.show/ref.hide控制modal打开关闭, 并将该modal开关的状态同步到global cache中保存

#### Token Standard

- token值定义需尽量语义化
- 以下所有值均采用token中的值，不包含在token中的值推动UED采用token中的值，保持一致性
  - border
  - color
  - font 
    除icon外，所以字体大小均使用此token
  - icon
  - space
  - radius
  - layout
    常用flex布局，eg:
    
    ```javascript
    export const betweenHorizontal: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    };
    ```
    
  - duration
    追加常用动画语义, eg:
    
    ```javascript
    export const toastDuration = animationDurationBase;
    export const progressDuration = animationDurationSm;
    export const modalInDuration = animationDurationBase;
    ```
    
  - zIndex
    通过维护一份数组管理布局层叠顺序
    
    ```javascript
    export const zIndexElements = ['mask', 'header', 'modal'];
    export const getIndex = element => zIndexElements.indexOf(element) + 1;
    ```
    

#### Theming Standard

- 通过bbk-theming的makeThemePropType方法定义组件所需theme值
- 通过bbk-theming的getThemeAttributes方法获取组件所需theme值

#### TypeScript Standard

- ts-ignore Standard
  
  - 尽量不使用ts-ignore，每个ts-ignore后追加原因，codeReview时关注ts-ignore原因
    
    ```javascript
    // @ts-ignore @ctrip/crn并未导出IBUButtonButtonSize定义
    import { IBUButtonButtonSize } from '@ctrip/crn';
    ```
    
  - 每过一月统计项目中ts-ignore数量，数量不得超过XX个，集体codeReview减少ts-ignore数量
    
- any Standard
  
  - 尽量不使用any，每过一月统计项目中any数量，数量不得超过XX个，集体codeReview减少any数量

#### EsLint Standard

待讨论

- 私有变量如何表示?
- 'style' is missing in props validationeslint(react/prop-types) 是否需要?

#### Coding Standard

- 除console外的注释代码不得存在
- 魔法数不得存在，使用常量或枚举代替
- 不得出现重复代码，需抽象公用
- 公用方法需注释描述参数含义

#### Hook Standard

- 只在最顶层使用 Hook
  **不要在循环，条件或嵌套函数中调用 Hook**， 确保总是在你的 React 函数的最顶层调用他们。遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 useState 和 useEffect 调用之间保持 hook 状态的正确。
  
- 只在 React 函数中调用 Hook
  不要在普通的 JavaScript 函数中调用 Hook。你可以：
   ✅ 在 React 的函数组件中调用 Hook
   ✅ 在自定义 Hook 中调用其他 Hook
   遵循此规则，确保组件的状态逻辑在代码中清晰可见。
  

#### Unit Test Standard

- 组件根目录新建__tests__文件夹存放测试用例文件
- 测试文件命名格式为xxxx.test.js
- 每个组件需生成一份snapshot快照
