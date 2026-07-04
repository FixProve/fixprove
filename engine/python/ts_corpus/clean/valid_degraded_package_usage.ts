import * as _ from "lodash";

const debounced = _.debounce(() => console.log("tick"), 200);
_.chain([1, 2, 3]).map((n) => n * 2).value();
