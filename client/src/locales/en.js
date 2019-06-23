export default {
  route:{
    board: 'Board',
    my_articles: 'Articles',
    my_journals: 'Journals',
    my_data: 'Data',
    dashboard: 'Dashboard',
    feeds: 'Feeds',
    settings: 'Settings',
    applications: 'Applications',
    reviewer_matcher: 'Reviewer Matcher',
    preprint_search: 'Preprint Search',
    services: 'Services',
    articles: 'Articles',
    journal: 'Journal'
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
  },
  template: {
    pythonFirst: `
# This file has been formatted to be functional with plotly Python
# Every modification will modify the graphic at the right of your screen.
# You can find some information about plotly and how to make
# good charts here : https://plot.ly/python/

import plotly.graph_objs as go
import plotly.io as plio

import numpy as np


# This function is used to insert your values into the plotly graph.
# This function is called in the main to populate data.
def plotly_values():
    y0 = np.random.randn(50) + 1.2
    y1 = np.random.randn(50) + 1
    y2 = np.random.randn(50) * 2
    y3 = np.random.randn(50) * 0.8 + 1

    trace0 = go.Box(
        y=y0,
        name='Sample A'
    )
    trace1 = go.Box(
        y=y1,
        name='Sample B'
    )
    trace2 = go.Box(
        y=y2,
        name='Sample C'
    )
    trace3 = go.Box(
        y=y3,
        name='Sample D'
    )
    data = [trace0, trace1, trace2, trace3]
    return data


# This function is used to modify the title of the graph.
# This function return the layout, and only this variable should be modified.
def plotly_layout():
    layout = "INSERT TITLE HERE"
    return layout


# This function is the main of the project.
# This function call plotly_values to get the data for the plotly graph.
# This part musn't be modified.
def main():
    data = plotly_values()
    layout = go.Layout(title=plotly_layout())
    figure = go.Figure(data=data, layout=layout)
    plio.write_json(figure, './example.json')
    exit(0)


if __name__ == "__main__":
    main()
`,
    pythonSecond: `
# This file has been formatted to be functional with plotly Python
# Every modification will modify the graphic at the right of your screen.
# You can find some information about plotly and how to make
# good charts here : https://plot.ly/python/

import plotly.graph_objs as go
import plotly.io as plio

import numpy as np
`,
    RFirst: `
# This file has been formatted to be functional with plotly R
# Every modification will modify the graphic at the right of your screen.
# You can find some information about plotly and how to make
# good charts here : https://plot.ly/r/

# This line is used to give the plotly library and musn't be removed
library(plotly)
library(rjson)

# This function contains values to print with the type of the plot,
# options and values to print.
# This function contains a lot of idea for your plots.
# Don't forget to check the documentation : some examples are given.
plotly_graphs <- function (name_layout) {
  y1 <- c(0.75, 5.25, 5.5, 6, 6.2, 6.6, 6.80, 7.0, 7.2, 7.5, 7.5, 7.75, 8.15,
          8.15, 8.65, 8.93, 9.2, 9.5, 10, 10.25, 11.5, 12, 16, 20.90, 22.3, 23.25)
  y2 <- c(0.75, 5.25, 5.5, 6, 6.2, 6.6, 6.80, 7.0, 7.2, 7.5, 7.5, 7.75, 8.15,
          8.15, 8.65, 8.93, 9.2, 9.5, 10, 10.25, 11.5, 12, 16, 20.90, 22.3, 23.25)
  y3 <- c(0.75, 5.25, 5.5, 6, 6.2, 6.6, 6.80, 7.0, 7.2, 7.5, 7.5, 7.75, 8.15,
          8.15, 8.65, 8.93, 9.2, 9.5, 10, 10.25, 11.5, 12, 16, 20.90, 22.3, 23.25)
  y4 <- c(0.75, 5.25, 5.5, 6, 6.2, 6.6, 6.80, 7.0, 7.2, 7.5, 7.5, 7.75, 8.15,
          8.15, 8.65, 8.93, 9.2, 9.5, 10, 10.25, 11.5, 12, 16, 20.90, 22.3, 23.25)

  p <- plot_ly(type = 'box') %>%
    add_boxplot(y = y1, jitter = 0.3, pointpos = -1.8, boxpoints = 'all',
                marker = list(color = 'rgb(7,40,89)'),
                line = list(color = 'rgb(7,40,89)'),
                name = "All Points") %>%
    add_boxplot(y = y2, name = "Only Whiskers", boxpoints = FALSE,
                marker = list(color = 'rgb(9,56,125)'),
                line = list(color = 'rgb(9,56,125)')) %>%
    add_boxplot(y = y3, name = "Suspected Outlier", boxpoints = 'suspectedoutliers',
                marker = list(color = 'rgb(8,81,156)',
                              outliercolor = 'rgba(219, 64, 82, 0.6)',
                              line = list(outliercolor = 'rgba(219, 64, 82, 1.0)',
                                          outlierwidth = 2)),
                line = list(color = 'rgb(8,81,156)')) %>%
    add_boxplot(y = y4, name = "Whiskers and Outliers", boxpoints = 'outliers',
                marker = list(color = 'rgb(107,174,214)'),
                line = list(color = 'rgb(107,174,214)')) %>%
    layout(title = name_layout)
}

response <- plotly_graphs("INSERT TITLE HERE")
json <- plotly_json(response, TRUE)
print(toJSON(json))
`,
    RSecond: `
# This file has been formatted to be functional with plotly R
# Every modification will modify the graphic at the right of your screen.
# You can find some information about plotly and how to make
# good charts here : https://plot.ly/r/

# This line is used to give the plotly library and musn't be removed
library(plotly)
library(rjson)
`
  }
}
