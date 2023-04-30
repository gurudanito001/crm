

export const getMonths = () =>{
  return  ["january","february","march","april","may","june","july",
  "august","september","october","november","december"];
}

export const getYears = () =>{
  var max = new Date().getFullYear() + 30
  var min = new Date().getFullYear() - 30
  var years = []

  for (var i = max; i >= min; i--) {
    years.push(i)
  }
  return years.reverse()
}