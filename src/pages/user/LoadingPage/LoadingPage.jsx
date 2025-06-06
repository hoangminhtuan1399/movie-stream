import './LoadingPage.css'

export const LoadingPage = (props) => {
  const { pageLoading } = props

  return (
    <div className={`loading-page bg-black d-flex justify-content-center align-items-center px-4 ${pageLoading ? 'loading' : 'loaded'}`}>
      <div className={'loading-page__content d-flex flex-column align-items-center gap-3 gap-sm-5'}>
        <img className={'loading-page__logo'} src="/logo.svg" alt="RoPhim"/>
        <div className="loading-page__heading fs-2 text-center text-secondary fw-bold">Xem Phim Miễn Phí Cực Nhanh, Chất
          Lượng Cao Và Cập Nhật Liên Tục
        </div>
      </div>
    </div>
  )
}
