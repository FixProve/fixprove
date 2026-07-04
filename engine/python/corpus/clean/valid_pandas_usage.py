import pandas as pd
from pandas import DataFrame, Series

df = pd.read_excel("report.xlsx")
df2 = pd.read_csv("data.csv")
s = Series([1, 2, 3])
merged = pd.concat([df, df2])
DataFrame({"a": [1, 2]})
