import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';

export default function CommentInput({emailAddress, commentContent, emailOnChange, CommentOnChange, OnSubmit}) {
  return (
    <div className={`${styles.commentInput} ${utilStyles.flex} ${utilStyles.column}`}>
      <form onSubmit={OnSubmit}>
        <div className={`${utilStyles.flex} ${styles.commentContainer}`}>
            <input value={emailAddress} onChange={emailOnChange} type="email" placeholder="Your email"></input>
            <textarea value={commentContent} onChange={CommentOnChange} placeholder="Write a comment…"></textarea>
            <div className={`${styles.commentButtonContainer}`}>
                <input disabled={emailAddress.length == 0 || commentContent.length === 0} className={`${styles.button} ${styles.primary} ${styles.commentButtonContainer}`} type="submit" value="Post" />
            </div>
        </div>
        </form>
    </div>
  );
}