function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Kaleum Studios</span>
      <div className="footer-socials">
        <a href="https://www.instagram.com/kaleumstudios/" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href="https://www.tiktok.com/@kaleum.studios" target="_blank" rel="noreferrer">
          TikTok
        </a>
        <a href="https://www.youtube.com/channel/UCRzX749f351NFEyMSVll50w" target="_blank" rel="noreferrer">
          YouTube
        </a>
      </div>
    </footer>
  )
}

export default Footer
