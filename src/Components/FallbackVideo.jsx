import styles from '../Styles/FallbackVideo.module.css'

const FallbackVideo = ({username}) => {
    return (
        <div className={styles.box}>
            <h1 className={styles.username}>{username[0].toUpperCase()}</h1>
            <h2 className={styles.status}>User no connected</h2>
        </div>
    )
}

export default FallbackVideo