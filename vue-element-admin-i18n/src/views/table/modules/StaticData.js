const Campuses = ['清水河校区', '沙河校区']
const QSHalls = ['九州厅（300人）',	'圆厅（300人）', 	'201报告厅（120人）', '202会议室（50人）',	'204会议室（30人）',	'216会议室（30人）']
const SHHalls = ['夏新厅（300人）',	'会议室（40人）',	'舞蹈排练厅（20人）',	'咖啡厅（20人）']
const Halls = [...QSHalls, ...SHHalls]
const ApprovalStatus = ['通过', '不通过', '待审核', '未上传图片']
// const ErrorCodes = {
//   '3001': '用户未登录',
//   '3002': '参数不完整',
//   '3006': '重复审核',
//   '3007': '学工号与姓名不匹配',
//   '3008': '该用户无审批权限'
// }

export { Campuses, Halls, QSHalls, SHHalls, ApprovalStatus }
