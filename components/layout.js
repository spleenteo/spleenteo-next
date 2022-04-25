import Alert from '../components/alert'
import Footer from '../components/footer'

const Layout = function({ preview, children }) {
  return (
    <div>
      <div className="min-h-screen">
        <Alert preview={preview} />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  )
};

export default Layout;