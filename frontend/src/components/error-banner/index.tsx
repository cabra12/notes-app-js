import './styles.css'

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
    return (
        <div className="error-banner">
            <p>{message}</p>
            <button onClick={onDismiss}>✕</button>
        </div>
    )
}

export default ErrorBanner
