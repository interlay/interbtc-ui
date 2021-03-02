
interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => (
  <div className='main d-flex flex-column min-vh-100 polkabtc-background fade-in-animation'>
    {children}
  </div>
);

export default Layout;
