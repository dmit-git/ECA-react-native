const Constants = require('../../../app.json');
const { CHAT_ENABLED } = Constants.expo.extra

const ROUTES = [
  {
    type: "agenda",
    icon: "md-calendar",
    offlineDisable: false
  },
  {
    type: 'feed',
    icon: 'md-pulse',
    offlineDisable: true
  },
  {
    type: 'notifications',
    icon: 'md-notifications',
    offlineDisable: true
  },
  {
    type: 'directory',
    icon: 'md-contacts',
    offlineDisable: true
  },
  {
    type: 'connections',
    icon: 'md-git-network',
    offlineDisable: true
  },
  {
    type: 'messages',
    icon: 'md-chatboxes',
    offlineDisable: true
  },
  {
    type: "libraryStack",
    icon: 'md-folder',
    offlineDisable: false
  },
  {
    type: "pageStack",
    icon: "md-document",
    offlineDisable: false
  }
]

export default (navItems = []) => {
  const items = [{
    name: 'Home',
    type: 'home',
    icon: 'md-home',
    offlineDisable: false
  }]

  if (!CHAT_ENABLED) navItems = navItems.filter(el => el.type != "messages")
  items.push(...navItems.map(item => {
    let el = ROUTES.find(route => route.type === item.type)
    return {...item, icon: el.icon, offlineDisable: el.offlineDisable }
  }))

  return items
}
