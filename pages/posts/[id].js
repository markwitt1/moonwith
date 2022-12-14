import Head from 'next/head';
import Layout from '../../components/layout';
import { getAllPostIds, getPostData, getSortedPostsData } from '../../lib/posts';
import Date from '../../components/date';
import Comment from '../../components/comment';
import PostRecommendation from '../../components/post_recommendation';
import LoadMore from '../../components/load-more';
import CommentInput from '../../components/comment-input';
import Link from 'next/link';
import utilStyles from '../../styles/utils.module.css';
import { useState } from 'react';
import ListOfComments from '../../components/list-of-comments';
import { useUser } from '@auth0/nextjs-auth0';


export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);

  // I'm giving recommendations based on the first tag we find.
  // This is not great but gets the jobs done for now.
  // The filter is removing the post with the same id from the recommendations.
  const firstTag = postData.tags[0];
  const allPostsData = getSortedPostsData(firstTag).filter(post => post.id !== postData.id).slice(0, 3);

  return {
    props: {
      postData,
      allPostsData
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostIds();

  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData, allPostsData }) {

  const { user, error, isLoading } = useUser();

  /* if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>; */

  let nextId = 0;

  const [showMore, setShowMore] = useState(false);

    function handleClick() {
        setShowMore(true);
      }

  const tags = postData.tags;

  //const [emailAddress, setEmailAddress] = useState('');
  const [commentContent, setCommentContent] = useState('');

  const [listOfSubmittedComments, setSubmittedComment] = useState([]);

  function handleCommentChange(e) {
    setCommentContent(e.target.value);
  }

    return (
      <Layout>
        <Head>
          <title>{postData.title}</title>
        </Head>
        <section>
        <article>
          <h1 className={utilStyles.heading2Xl}>{postData.title}</h1>
          <div className={utilStyles.lightText}>
            <Date dateString={postData.date} />
          </div>

        {/* TODO */}
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />

          <section>
            <h3 className={utilStyles.headingMd}>Tags</h3>
      
            {tags.map(tag => (
                <Link href={`/tags/${tag}`}>
                  <span className='tag'>{tag.slice(0,1).toUpperCase() + tag.slice(1)}</span>
                </Link>
              ))}
          </section>

          <br/>
          {/* FIX: I shouldn't be targetting the whole section but the LoadMore element.  */}
          <section onClick={handleClick}>
            {!showMore ?
            (
              <>
              <LoadMore label={"Load Comments"}/>
              </>
            ) :
            (
              <>
              <h3 className={utilStyles.headingMd}>Comments</h3>
              
              {user ? (
                <CommentInput
                commentContent={commentContent}
                CommentOnChange={handleCommentChange}
                OnSubmit={e => {
                  e.preventDefault();
                  setSubmittedComment([
                    { id: nextId++, author: user.nickname, content: commentContent },
                    ...listOfSubmittedComments, // Keeps old items at the end.
                  ]);
                  
                  fetch(`/api/comments`, {
                    method: 'POST',
                    body: JSON.stringify({
                      post_id: postData.id,
                      author: user.nickname,
                      user_id: user.sub,
                      content: commentContent,
                    }),
                    headers: {'Content-Type':'application/json'}
                   }).then(response => console.log(response.json()));
                  setCommentContent('');
                }}
              />
              ) : (
                <div className={utilStyles.commentsSignup}>🌙 Be part of my exclusive community. <Link href="/api/auth/login">Sign up</Link> in order to leave a comment and see the hidden side of the Moon.</div>
              )}

              <div>
                {/* TODO: Fetch user details from Auth0 based on the user_id (sub). */}
                {listOfSubmittedComments.map(comment => (
                    <Comment author={comment.author} content={comment.content} key={comment.id}/>
                ))}
              </div>

              {
                      <ListOfComments post_id={postData.id} />
                
            }
              </>
            )
            }
            
          </section>

          <br/>
          <section>
            <h3 className={utilStyles.headingMd}>Other essays you may like</h3>
            <div>
            {allPostsData.map(({ id, title, contentPreview }) => (
              <PostRecommendation id={id} title={title} contentPreview={contentPreview}/>
            ))}
            </div>
          </section>
       
        </article>
        </section>
      </Layout>
    );
  }