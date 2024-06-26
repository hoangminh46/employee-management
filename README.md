Tổng quan chức năng dự án mock project

1. Trang Login

- Đăng nhập
  o Validate form đăng nhập
  o Thông báo trạng thái đăng nhập
  o Đăng nhập thành công -> redirect đến trang admin hoặc user tuỳ theo role
  o Lưu userToken vào localStorage
- Đăng xuất
  o Xoá userToken trong localStorage, xoá thông tin user trong redux store, redirect người dùng đến trang login
- Quên mật khẩu
  o Validate mail nhập vào
  o Nếu có mail trong hệ thống -> gửi mail cho user với nội dung là mật khẩu mới, đồng thời sửa mật khẩu của user đó trong database
- Authorization
  o Phân quyền cho user và admin, chỉ admin được truy cập những trang của admin (tương tự với user), khi cố tình truy cập -> Redirect đến trang Unauthorized
  o Khi truy cập đến các link không có -> Redirect đến trang 404 Not Found

2. Trang Admin

- Hiển thị thông tin nhân viên
  o Thêm, xoá, sửa thông tin cần thiết của nhân viên trong hệ thống (những thông tin riêng tư sẽ để user tự thêm), hiển thị thông báo mỗi lần hành động
- Tìm kiếm nhân viên theo tên, tìm kiếm onchange, thay đổi theo mỗi lần nhập input
- Xem chi tiết nhân viên bằng cách click vào tên nhân viên
- Tạo pagination cho table nhân viên, giới hạn 5 thông tin/ trang
- Gửi tin nhắn
  o Hiển thị form điền thông tin, bao gồm list nhân viên nhận tin, nội dung tin, ngày gửi, thời gian gửi (Hiện tại chưa có api backend, chưa hoàn thiện chức năng)
- Có trang cá nhân, có thể sửa thông tin của mình trong trang cá nhân

3. Trang User

- Chức năng chấm công
  o Hiển thị table date của từng tháng, có thể thay đổi các tháng khác nhau, hiển thị thông tin chấm công của nhân viên bao gồm tổng thời gian làm việc hôm đó, giờ checkin, giờ checkout, trạng thái (chấm công thành công – màu xanh, không chấm công – màu đỏ, checkin nhưng chưa checkout- màu vàng)
  o Check các trường hợp chấm công để tính toán thời gian công chính xác (checkin sớm/muộn, checkout sớm/muộn, trừ giờ nghỉ trưa…)
  o Hiển thị tổng số công của tháng (số công hiện tại/tổng số công tháng). Nếu sang tháng mới, thông tin này sẽ tự cập nhật dựa theo tháng đó
- Chức năng xem thông tin nhân viên
  o Hiển thị các thông tin cơ bản của nhân viên khác
  o Xem profile của họ bằng cách bấm vào tên
  o Tìm kiếm nhân viên khác theo tên
  o Pagination cho table nhân viên
- Chỉnh sửa thông tin cá nhân (không thể chỉnh sửa các thông tin như quyền hạn, username, position,….)

4. Tổng kết

- Giao diện đơn giản, dễ sử dụng
- Các chức năng hầu như đều sử dụng api, dữ liệu thay đổi sẽ được lưu vào data
- Một số chức năng còn đơn giản, cần cải thiện
  o Chức năng đăng nhập: Nên cho user đăng nhập bằng tên tài khoản hoặc email
  o Chức năng quên mật khẩu: Nên gửi link reset mật khẩu cho user thay vì gửi thẳng mật khẩu mới
  o Chức năng tìm kiếm nhân viên: Nên thêm các điều kiện tìm kiếm khác (ví dụ như email, username), hiện tại chỉ tìm kiếm theo tên
  o Backend và Front-end chưa chặt chẽ, nếu người dùng có hiểu biết về web có thể sẽ làm sai lệch thông tin
  o Validate chưa chặt chẽ (username, password cần tối thiểu bao nhiêu ký tự, chưa validate số điện thoại..)
  o Thông tin các nhân còn sơ sài, nên thêm nhiều trường thông tin nữa (ngày sinh, quốc tịch, loại hợp đồng…), cần thêm chức năng ảnh đại diện, có thể upload và sửa ảnh đại diện
  o Chưa phát triển chức năng gửi tin nhắn phía backend
  o Chức năng chấm công còn đơn giản (có thể bổ sung các chức năng con như tính thời gian OT, thời gian đi muộn, ngày nghỉ có lương, ngày nghỉ không lương, ngày lễ…) các chức năng này liên quan nhiều đến nghiệp vụ hệ thống
