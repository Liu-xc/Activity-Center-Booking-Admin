const Mock = require('mockjs')

const List = []
const count = 100

// const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
// const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    appleID: '@increment',
    submitTime: +Mock.Random.date('T'),
    start: +Mock.Random.date('T'),
    end: +Mock.Random.date('T'),
    'reserveUser|1': ['教师工会', '班级', '学生会', '舞蹈社'],
    'reserveHall|1': ['夏新厅（300人）',	'会议室（40人）',	'舞蹈排练厅（20人）',	'咖啡厅（20人）', '九州厅（300人）',	'圆厅（300人）', 	'201报告厅（120人）', '202会议室（50人）',	'204会议室（30人）',	'216会议室（30人）'],
    'approveStatus|1': ['通过', '不通过', '待审核', '未上传图片'],
    'activity|1': ['新年晚会', '成电讲坛', '迎新晚会', '艺术节'],
    auditComment: Mock.Random.paragraph(1),
    imgs: [Mock.Random.image(), Mock.Random.image(), Mock.Random.image()],
    conflict: {	// 冲突标志
		  'isConflict|1': [true, false], // 是否有冲突
		  'allHandled|1': [true, false] // 所有冲突项是否已经处理（只有一个通过，其余的不通过时设置为真）
		}

    // timestamp: +Mock.Random.date('T'),
    // author: '@first',
    // reviewer: '@first',
    // title: '@title(5, 10)',
    // content_short: 'mock data',
    // content: baseContent,
    // forecast: '@float(0, 100, 2, 2)',
    // importance: '@integer(1, 3)',
    // 'type|1': ['CN', 'US', 'JP', 'EU'],
    // 'ApprovalStatus|1': ['published', 'draft'],
    // display_time: '@datetime',
    // comment_disabled: true,
    // pageviews: '@integer(300, 5000)',
    // image_uri,
    // platforms: ['a-platform']
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/article/list',
    type: 'get',
    response: config => {
      const { ReserveDepartment, Activity, campus, ReserveHall, ApproveStatus, DisplayPage = 1, DisplayRows = 20 } = config.query

      let mockList = List.filter(item => {
        if (ReserveDepartment && item.ReserveDepartment !== ReserveDepartment) return false
        if (Activity && item.Activity !== Activity) return false
        if (campus && item.campus !== campus) return false
        if (ReserveHall && item.ReserveHall !== ReserveHall) return false
        if (ApproveStatus && item.ApproveStatus !== ApproveStatus) return false
        return true
      })


      const pageList = mockList.filter((item, index) => index < DisplayRows * DisplayPage && index >= DisplayRows * (DisplayPage - 1))

      return {
        code: 200,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 200,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 200,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-element-admin/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]

