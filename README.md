# 十分钟上手 Next.js

## 前言

[Next.js](https://nextjs.org/) 已经出来很久了，但是一直没机会看这个框架。

以前一直在用 **create-react-app** 来创建 React 项目，奈何 CRA 实在太难用了，今天花了点时间扫了一下 Next.js 的官网，发现用起来还挺简单的。

## Next.js

虽然 Next.js 总被人称为 SSR 框架，其实 Next.js 还提供了很多功能，比如官网列出来的这些：


![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7da0720f10944208ab3e03e82d2f7d2d~tplv-k3u1fbpfcp-watermark.image?)

所以说，Next.js 更像是一个框架，包含了路由、优化、SSR 等一系列功能。

## 起步
和 [create-react-app](https://create-react-app.dev/) 一样，Next.js 一样有个 **create-next-app** 的脚手架。

```sh
create-next-app demo
```

使用上面命令后就可以创建一个 Next.js 框架的 React 项目。

## 路由

Next.js 也提供了路由系统，采用名字约定路由

* `pages/index.js` 对应 `/`
* `pages/xxx/first.js` 对应 `/xxx/first`

使用 `Link` 组件来做路由跳转

```js
function FirstPost() {
  return (
    <>
      <h1>First Post</h1>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
    </>
  )
}
```

有的时候需要跳转到外链，可以使用 `<a>` 标签就可以。

## 静态资源

静态资源用的最多的就是 **图片** 了，Next.js 提供了 `Image` 组件来替代 `img`。

`Image` 组件的好处就是可以提高网页加载图片的性能，可以自动按需加载，当图片进入视图时再加载图片。

除了相对路径引入，还可以将图片放在 `public/images/` 下，然后用 “绝对路径” 引入。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fa715dc509d47a1ad2377ca8221a311~tplv-k3u1fbpfcp-watermark.image?)

```js
export default function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src="/profile.jpg"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}
```

## MetaData

网页的 Meta Data 主要是指 `<head>` 元素里的内容，Next.js 直接提供了一个 `<Head>` 组件来包裹这些 Meta Data。

```js
<Head>
   <title>First Post</title>
</Head>
```

好处就是可以在不同的页面组件里写不同的 Meta Data。

## CSS

样式这一块和 `create-react-app` 差不多，使用 CSS module，命名为 `xxx.module.css` 就可以了，否则别的 CSS 文件都需要 `import 'xxx.css'` 来引入 CSS 样式。

**需要注意的是全局样式引入只能在 `pages/_app.js` 的根文件里引入。**

上述操作 Sass 同理。

## 预渲染

终于来到 Next.js 最引以为豪的 **预渲染** 了。Next.js 提供了三种渲染方式：

* Client-side Rendering (CSR)
* Static Generation (SSG)
* Server-side Rendering (SSR)

### Client-side Rendering

客户端渲染其实就是我们经常看到的前后端分离的场景了：只提供一个 html，拿到 `<script>` 的 JS 再去渲染页面。

```js
import useSWR from 'swr'

function Profile() {
  const { data, error } = useSWR('/api/user', fetch)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

由于需要等加载到 JS 再渲染页面，所以这种渲染方式的有以下缺点：
* SEO 不友好
* 白屏时间较长

聪明的前端程序员就想：当访问 URL 的时候，我直接把数据都放到 HTML 上，那爬虫就可以直接拿到页面的信息，解决 SEO 的问题了，同样的不需要等 JS 加载完再发 Ajax 获取数据了，基础数据优先展示，也就能解决白屏时间过长的问题了。

所以，预渲染说的就是 SSG 和 SSR。

### Static Generation

Static Generation 会在 **build time 的 production** 时候直接将数据写在 HTML 上，所以一般来说这些数据都是以静态、固定为主。

```js
export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}
```

将 `getStaticProps` 这个函数 `export` 出来，里面则为 build time 时获取数据的逻辑。

### Server-side Rendering

通常情况下，我们很少使用静态的数据，一般以动态数据为主，不可能每次数据更新了又要打包一遍。所以就有了 Server-side Rendring。

Server-side Rendering 则在每次 **请求这个 URL** 的时候，都会执行一次数据获取并生成 HTML 返回给前端。

> 看到这里你可能会想 Next.js 和以前的 PHP、JSP 有什么区别么？都是吐 HTML 的呀。
> Next.js 这里的 SSR 其实是同构渲染，即一套代码两端执行，具体区别请看[这篇回答](https://www.zhihu.com/question/379598562/answer/1081908468)

和 Static Generation 类似，Server-side Rendering 同样有一个对应的需要 `export` 出一个 `getServerSideProps` 函数。

```js
export async function getServerSideProps(context) {
  return {
    props: {
      // props for your component
    }
  }
}
```

## 动态路由

所谓动态路由就是可以生成 `posts/:id` 这样的路由，`:id` 可以为 post 的 id。文件命名只需要写成 `[id].js` 就可以了。

在页面组件文件里，可以通过前面说到的 `getStaticProps` 和 `getServerSideProps` 获取 params：

```js
export async function getStaticProps({ params }) {
  const postData = getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}
```

其中，`pages/posts/[...id].js` 会匹配 `/posts/a/b` 路由和 `/posts/a`，`...` 为全匹配。

## API

除了正常写页面外，有时候我们还需要提供 API 接口，可以在 `pages/api` 下添加文件，文件名则为 API 名。

注意：**不能在 `getStaticProps` 和 `getStaticPaths` 里添加 fetch 数据，因为他们只在 server side 运行，不会在 client side 运行，应该使用 helper function 来获取数据。**

API 代码将不会在 client side 的 bundle 里。

## 部署

部署这一块 Next.js 推荐使用 [Vercel](https://vercel.com/dashboard) 来部署。

因为 Vercel 本身就是为 Next.js 服务的，所以只需要连上 Github Repo 就可以一键部署了。

## 总结

稍微总结一下，Next.js 提供的有如下功能：

* `Link` 组件，方便路由
* `Image` 组件，优化图片加载
* 文件路径生成路由机制，动态路由使用 `[id].js` 这样的命令
* SSR、SSG 的同构开发模式（其实就是 export 一个对应名字的函数，在里面提前获取数据就好了）
* 样式方面和 `create-react-app` 差不多
