
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
