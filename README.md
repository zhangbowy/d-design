## 项目名称
> 请介绍一下你的项目吧  

## 组件范式
3.1 各组件目录规范

统一目录
都放在packages

统一结构
```js
├── components // 组件目录
├── style  // 样式
├── index.ts // 导出的文件
```

## 组件库本地开发
### 组件本地开发
#### 1、packages下按目录规范创建你的组件

#### 2、组件库项目link到全局
```js
npm link
```
#### 3、其他任意项目 把pu-ui link到本项目node_modules
```js
npm link d-design
```
#### 4、引入测试
```js
import { ChooseUser } from 'pu-ui';
```
