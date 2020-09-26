FROM mongo
COPY . .
CMD mongoimport --host=mongo --db items --collection items --file ./mockEntries.json