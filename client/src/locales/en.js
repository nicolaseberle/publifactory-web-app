export default {
  route:{
    board: 'Board',
    my_articles: 'My Articles',
    my_journals: 'My Journals',
    my_data: 'My Data',
    dashboard: 'Dashboard',
    feeds: 'Feeds',
    settings: 'Settings',
    applications: 'Applications',
    reviewer_matcher: 'Reviewer Matcher',
    preprint_search: 'Preprint Search',
    services: 'Services'
  },
  title: 'Editorial Manager',
  registerTitle: 'Register',
  constant: {
    name: 'Name',
    desc: 'Description'
  },
  confirm: {
    title: 'Warning',
    ok: 'save',
    cancel: 'cancel',
    prevStep: 'Previous',
    nextStep: 'Next',
    remove: 'This will remove the selected {content} forever, continue?',
    confirmSelected: 'You have selected the following items. Please confirm your choices as this action can\'t be recoveried'
  },
  label: {
    name: 'Name',
    enable: 'Enable'
  },
  status: {
    enabled: 'Enabled',
    disabled: 'Disabled'
  },
  operation: {
    add: 'Add',
    create: 'Create',
    edit: 'Edit',
    update: 'Update',
    remove: 'Remove',
    multiRemove: 'Multi remove',
    operation: 'Operation',
    search: 'Search',
    enable: 'Click to enable',
    disable: 'Click to disable',
    action: 'Action'
  },
  message: {
    save: {
      ok: 'Saved!',
      err: 'Error occured when saving!'
    },
    error: 'Error',
    created: 'Create successed',
    createFailed: 'Create failed',
    updated: 'Update successed',
    updateFailed: 'Update failed',
    removed: 'Delete successed',
    removeFailed: 'Delete failed',
    changeRole: 'The roles have been updated',
    changeRoleFail: 'The role hasn\'t been updated',
    scriptSuccess: 'The script has been executed correctly!',
    scriptFailure: 'The script hasn\'t worked ; check if you don\'t make a mistake.'
  },
  http: {
    error: {
      E401: 'Not authorized',
      E403: 'Permission not allowed',
      E404: 'Url not found',
      E500: 'Server error',
      others: 'Some error occured, please try again'
    }
  }
}
