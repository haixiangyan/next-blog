import {getAllPostIds, getPostData} from "../../lib/posts";
import Layout from "../../components/layout";

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}

function Posts({postData}) {
  return (
    <Layout>
      {postData.title}
      <br/>
      {postData.id}
      <br/>
      {postData.date}
      <div dangerouslySetInnerHTML={{__html: postData.contentHtml}}/>
    </Layout>
  )
}

export default Posts;
