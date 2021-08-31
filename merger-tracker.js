//case insensitive jquery matching
jQuery.expr[':'].icontains = function(a, i, m) {
  return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};

// JavaScript for hyperlinking rows
function URLRedirect() {
  window.open("https://www.law360.com/articles/" + $(this).attr('id'));
};

// handling form submission
$('#emit').submit(function(event) {
  event.preventDefault();
  return false;
});

$('#emit_data').submit(function(event) {
  event.preventDefault();
  return false;
});

//JavaScript for converting csv to table
var globaldata = new Array();
var firmset = new Set();
var parseDate = d3.timeParse("%Y");
d3.csv("https://assets.law360news.com/1339000/1339949/all_awards_2021-08-05_v3.csv").then(function(data) {
  $('table').find('#data-load').each(function() {
    this.remove();
  });

  for (let i = 0; i < data.length; i++) {
    var globaldata_row = new Object();
    var tbl = document.getElementById("table-content-inner");
    var row = tbl.insertRow();
    row.className = "content-row";
    row.id = data[i].legacy_id.toString();
    globaldata_row['id'] = data[i].legacy_id.toString();
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    cell0.className = "cell0";
    cell1.className = "cell1";
    cell2.className = "cell2";
    cell3.className = "cell3";
    cell4.className = "cell4";
console.log(globaldata_row['id'])

    // blank space for firm awards without individual atty name
    cell0.innerHTML = data[i].name !== "" ? data[i].name : "&nbsp;";
    globaldata_row['name'] = data[i].name;
    cell1.innerHTML = data[i].firm;
    firmset.add(data[i].firm);
    globaldata_row['firm'] = data[i].firm;
    var sectionArr = data[i].practice.replace(/['\[\]]/ig, "").split(",");
    for (let x = 0; x < sectionArr.length; x++) {
      $('#{} .cell2'.replace("{}", data[i].legacy_id.toString())).append("<p>{}</p>".replace("{}", sectionArr[x]));
    }
    globaldata_row['practice'] = sectionArr;
    cell3.innerHTML = data[i].date;
    globaldata_row['date'] = data[i].date;
    cell4.innerHTML = data[i].award;
    globaldata_row['award'] = data[i].award;
    globaldata.push(globaldata_row);
  }

  $("#data-table tbody tr").on('click', URLRedirect);

  //Remove blank firm
  var newFirmset = Array.from(firmset).sort()
  newFirmset.shift()

  d3.select(".dropdown-firm-content")
    .selectAll('p')
    .data(newFirmset)
    .enter()
    .append('p')
    .text(dta => dta);

  $('.dropdown-firm-content p').on('click', function(e) {
    $('.dropdown-firm-content')
      .removeClass('show');
    $('.dropdown-firm').find('#dropdown-firm-input').val("");
  })

  $('table').trigger('update');
});

// pagination
$(document).ready(function() {
  $("table")
    .tablesorter({
      widthFixed: true,
      delayInit: true,
      ignoreCase: true,
      sortReset: true,
      sortList: [
        [3, 1],
        [4, 0],
        [1, 0],
        [0, 0]
      ],
      emptyTo: "bottom"
    })
    .tablesorterPager({
      container: $(".pager"),
      removeRows: false,
      output: '{startRow} to {endRow} of {totalRows} rows',
      updateArrows: true
    });

  $('#emit_data').keyup(searchFunction);
});

// JavaScript for searching table
function searchFunction() {
  var $row,
    row = "<tr class='content-row' id='{y}'><td class='cell0'>{z}</td><td class='cell1'>{m}</td><td class='cell2'>{g}</td><td class='cell3'>{r}</td><td class='cell4'>{j}</td></tr>";
  var r = "";
  var input = document.getElementById("emit_data");
  var input_up = input.value.toUpperCase();
  var date_range = [];
  for (let i = slide_min; i <= slide_max; i++) {
    date_range.push(i.toString());
  }

  // loop through data
  for (let i = 0; i < globaldata.length; i++) {
    var tmpstr = "";
    for (let x = 0; x < globaldata[i].practice.length; x++) {
      tmpstr = tmpstr + "<p>" + globaldata[i].practice[x] + "</p>"
    };

    // check award filter, practice filter, date range, and query
    if (award_arr && award_arr.length && practice_arr && practice_arr.length) {
      if (award_arr.includes(globaldata[i].award.toUpperCase()) && practice_arr.some(r => globaldata[i].practice.map(function(x) {
          return x.toUpperCase()
        }).indexOf(r) > -1) && date_range.includes(globaldata[i].date) && (globaldata[i].firm.toUpperCase().indexOf(input_up) > -1 || globaldata[i].name.toUpperCase().indexOf(input_up) > -1)) {
        r = r + row.replace(/\{[zmgrjy]\}/g, function(m) {
          return {
            '{z}': globaldata[i].name,
            '{m}': globaldata[i].firm,
            '{g}': tmpstr,
            '{r}': globaldata[i].date,
            '{j}': globaldata[i].award,
            '{y}': globaldata[i].id
          } [m];
        });
      }
      // check award filter, date range, and query
    } else if (award_arr && award_arr.length) {
      if (award_arr.includes(globaldata[i].award.toUpperCase()) && date_range.includes(globaldata[i].date) && (globaldata[i].firm.toUpperCase().indexOf(input_up) > -1 || globaldata[i].name.toUpperCase().indexOf(input_up) > -1)) {
        r = r + row.replace(/\{[zmgrjy]\}/g, function(m) {
          return {
            '{z}': globaldata[i].name,
            '{m}': globaldata[i].firm,
            '{g}': tmpstr,
            '{r}': globaldata[i].date,
            '{j}': globaldata[i].award,
            '{y}': globaldata[i].id
          } [m];
        });
      }
      // check practice filter, date range, and query
    } else if (practice_arr && practice_arr.length) {
      if (practice_arr.some(r => globaldata[i].practice.map(function(x) {
          return x.toUpperCase()
        }).indexOf(r) > -1) && date_range.includes(globaldata[i].date) && (globaldata[i].firm.toUpperCase().indexOf(input_up) > -1 || globaldata[i].name.toUpperCase().indexOf(input_up) > -1)) {
        r = r + row.replace(/\{[zmgrjy]\}/g, function(m) {
          return {
            '{z}': globaldata[i].name,
            '{m}': globaldata[i].firm,
            '{g}': tmpstr,
            '{r}': globaldata[i].date,
            '{j}': globaldata[i].award,
            '{y}': globaldata[i].id
          } [m];
        });
      }
      // check date range and query
    } else if (date_range.includes(globaldata[i].date) && (globaldata[i].firm.toUpperCase().indexOf(input_up) > -1 || globaldata[i].name.toUpperCase().indexOf(input_up) > -1)) {
      r = r + row.replace(/\{[zmgrjy]\}/g, function(m) {
        return {
          '{z}': globaldata[i].name,
          '{m}': globaldata[i].firm,
          '{g}': tmpstr,
          '{r}': globaldata[i].date,
          '{j}': globaldata[i].award,
          '{y}': globaldata[i].id
        } [m];
      });
    }
  };
  $row = $(r);
  $('table')
    .find('.content-row').each(function() {
      this.remove();
    });
  $('table').trigger('update');
  $('table')
    .find('tbody').append($row)
    .trigger('addRows', [$row]);
  $("#data-table tbody tr").on('click', URLRedirect);
  if (document.getElementById("table-content-inner").rows.length == 0) {
    $('table').find('tbody').append($("<tr class='content-row'><td></td><td></td><td>No matches were found.</td><td></td><td></td></tr>"));
  }
  return false;
};

// JavaScript for showing dropdown menus
$('.dropdown-award .dropdown-award-btn').on('click', (event) => {
  $(event.target).siblings('#dropdown-award-content-id')
    .toggleClass('show');
});

$(document).click(function(e) {
  $('.dropdown-award')
    .not($('.dropdown-award').has($(e.target)))
    .children('#dropdown-award-content-id')
    .removeClass('show');
});

$('.dropdown-practice .dropdown-practice-btn').on('click', (event) => {
  $(event.target).siblings('#dropdown-practice-content-id')
    .toggleClass('show');
  $('.dropdown-practice').find('#dropdown-practice-input').val("");
  filterMenuPractice();
});

$(document).click(function(e) {
  $('.dropdown-practice')
    .not($('.dropdown-practice').has($(e.target)))
    .children('#dropdown-practice-content-id')
    .removeClass('show');
  $('.dropdown-practice')
    .not($('.dropdown-practice').has($(e.target)))
    .find('#dropdown-practice-input').val("");
  filterMenuPractice();
});

$('.dropdown-firm .dropdown-firm-btn').on('click', (event) => {
  $(event.target).siblings('#dropdown-firm-content-id')
    .toggleClass('show');
  $('.dropdown-firm').find('#dropdown-firm-input').val("");
  filterMenuFirm();
});

// $('.dropdown-firm-content').not(":nth-child(1)").on('click', function(e) {
//   $('.dropdown-firm-content')
//     .removeClass('show');
//   $('.dropdown-firm').find('#dropdown-firm-input').val("");
// })

$(document).click(function(e) {
  $('.dropdown-firm')
    .not($('.dropdown-firm').has($(e.target)))
    .children('#dropdown-firm-content-id')
    .removeClass('show');
  $('.dropdown-firm')
    .not($('.dropdown-firm').has($(e.target)))
    .find('#dropdown-firm-input').val("");
  filterMenuFirm();
});

$('.dropdown p').click(function(e) {
  $('.dropdown')
    .removeClass('show');
})

//JavaScript for searching dropdown menu
function filterMenuPractice() {
  var input = document.getElementById("dropdown-practice-input");
  var input_up = input.value.toUpperCase();
  var div = document.getElementById("dropdown-practice-content-id");
  var p = div.getElementsByTagName("p");
  for (let i = 0; i < p.length; i++) {
    txtValue = p[i].textContent || p[i].innerText;
    if (txtValue.toUpperCase().indexOf(input_up) > -1) {
      p[i].style.display = "";
    } else {
      p[i].style.display = "none";
    }
  }
};

function filterMenuFirm() {
  var input = document.getElementById("dropdown-firm-input");
  var input_up = input.value.toUpperCase();
  var div = document.getElementById("dropdown-firm-content-id");
  var p = div.getElementsByTagName("p");
  for (let i = 0; i < p.length; i++) {
    txtValue = p[i].textContent || p[i].innerText;
    if (txtValue.toUpperCase().indexOf(input_up) > -1) {
      p[i].style.display = "";
    } else {
      p[i].style.display = "none";
    }
  }
};

// JavaScript for slider
// https://jqueryui.com/slider/#range
var slide_max, slide_min;
$(function() {
  $("#slider-range").slider({
    range: true,
    min: 2010,
    max: 2021,
    values: [2010, 2021],
    slide: function(event, ui) {
      slide_max = ui.values[1];
      slide_min = ui.values[0];
      searchFunction();
      var delay = function() {
        var handleIndex = $(ui.handle).index();
        var label = handleIndex == 2 ? '#min' : '#max';
        $(label).html(ui.value).position({
          my: 'center top',
          at: 'center bottom',
          of: ui.handle,
          offset: "0, 11"
        });
      };
      setTimeout(delay, 5);
    }
  });
  slide_max = $("#slider-range").slider("values", 1);
  slide_min = $("#slider-range").slider("values", 0);

  $('#min').html(slide_min).position({
    my: 'center top',
    at: 'center bottom',
    of: $('#slider-range span').eq(0),
    offset: "0, 11"
  });

  $('#max').html(slide_max).position({
    my: 'center top',
    at: 'center bottom',
    of: $('#slider-range span').eq(1),
    offset: "0, 11"
  });
  searchFunction();
});

// Declare variables
var award_arr = [];
var practice_arr = [];

// JavaScript for removing from bank by clicking bank filter
function removeFilter() {
  var n = $(this).text().toUpperCase();
  if (award_arr.indexOf(n) > -1) {
    award_arr.splice(award_arr.indexOf(n), 1);
    document.getElementById(n).remove();
    $(".dropdown-award-content p:icontains('{}')".replace("{}", n)).find("i").toggleClass("fa-square-o fa-check-square-o");
  } else if (practice_arr.indexOf(n) > -1) {
    practice_arr.splice(practice_arr.indexOf(n), 1);
    document.getElementById(n).remove();
    $(".dropdown-practice-content p:icontains('{}')".replace("{}", n)).find("i").toggleClass("fa-square-o fa-check-square-o");
  }
  searchFunction();
};

// JavaScript for removing all filters
function removeAllFilters() {
  award_arr = [];
  practice_arr = [];
  var $slider = $("#slider-range");
  $slider.slider("values", 0, 2010);
  $slider.slider("values", 1, 2021);
  slide_min = 2010;
  slide_max = 2021;
  $('#min').html(slide_min).position({
    my: 'center top',
    at: 'center bottom',
    of: $('#slider-range span').eq(0),
    offset: "0, 11"
  });

  $('#max').html(slide_max).position({
    my: 'center top',
    at: 'center bottom',
    of: $('#slider-range span').eq(1),
    offset: "0, 11"
  });
  const tag = document.querySelector("#filter-bank-content");
  while (tag.firstChild) {
    tag.removeChild(tag.firstChild);
  }
  $(".dropdown-practice-content p i").removeClass("fa-square-o").removeClass("fa-check-square-o").addClass("fa-square-o");
  $(".dropdown-award-content p i").removeClass("fa-square-o").removeClass("fa-check-square-o").addClass("fa-square-o");
  searchFunction();
};

// JavaScript for saving filters and adding to/removing from bank
function award_filter() {
  var n = $(this).text().toUpperCase();
  if (award_arr.indexOf(n) > -1) {
    award_arr.splice(award_arr.indexOf(n), 1);
    document.getElementById(n).remove();
    $(".dropdown-award-content p:icontains('{}')".replace("{}", n)).find("i").toggleClass("fa-square-o fa-check-square-o");
  } else {
    award_arr.push(n);
    const tag = document.getElementById("filter-bank-content")
    const newTag = document.createElement("button");
    newTag.setAttribute('id', n);
    newTag.setAttribute('class', "filter-bank-single");
    if (n != "MVP") {
      var words = n.toLowerCase().split(" ");
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      }
      words = words.join(" ");
    } else {
      var words = n
    }
    const content = document.createTextNode(words);
    newTag.appendChild(content);
    tag.appendChild(newTag);
    $(".dropdown-award-content p:icontains('{}')".replace("{}", n)).find("i").toggleClass("fa-square-o fa-check-square-o");
  }
  searchFunction();
};

function practice_filter() {
  var n = $(this).text().toUpperCase();
  if (practice_arr.indexOf(n) > -1) {
    practice_arr.splice(practice_arr.indexOf(n), 1);
    document.getElementById(n).remove();
    $(".dropdown-practice-content p:icontains('{}')".replace("{}", n)).find("i").toggleClass("fa-square-o fa-check-square-o");
  } else {
    practice_arr.push(n);
    const tag = document.getElementById("filter-bank-content")
    const newTag = document.createElement("button");
    newTag.setAttribute('id', n);
    newTag.setAttribute('class', "filter-bank-single");
    var words = n.toLowerCase().split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    words = words.join(" ");
    const content = document.createTextNode(words);
    newTag.appendChild(content);
    tag.appendChild(newTag);
    $(".dropdown-practice-content p:icontains('{}')".replace("{}", n)).find("i").toggleClass("fa-square-o fa-check-square-o");
  }
  searchFunction();
};

// event handlers
$(document).ready(function() {
  $('#dropdown-practice-input').keyup(filterMenuPractice);
  $('#dropdown-firm-input').keyup(filterMenuFirm);
  $(".dropdown-practice-item").click(practice_filter);
  $(".dropdown-award-item").click(award_filter);
  $('.clear-container').on('click', '.clear-all-btn', removeAllFilters);
  $('.filter-bank-content').on('click', '.filter-bank-single', removeFilter);
});

// update svg tags with data viz
function updateLine(d, t) {
  d3.selectAll(".line-chart > *").remove();

  const svg = d3.select('.line-chart');
  const width = window.innerWidth < 768 ? window.innerWidth : 640;
  const height = window.innerWidth < 768 ? 350 : 500;
  const title = "Awards won over time by the firm " + t;
  const xValue = d => d.date;
  const xAxisLabel = "Years";
  const yValue = d => d.count;
  const yAxisLabel = "Number of awards won";
  const colorValue = d => d.award;
  const margin = {
    top: 25,
    right: 50,
    bottom: 50,
    left: 50
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3.scaleTime()
    .domain(d3.extent(d, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = d3.scaleLinear()
    .domain([0, 22])
    //Was d3.extent(d, yValue), now constant max for easy comparison between firms,
    //need to programatically change, or check Gibson Dunn's max
    .rangeRound([innerHeight, 0])
    .nice();

  const yAxisTicks = yScale.ticks()
    .filter(tick => Number.isInteger(tick));

  const colorScale = d3.scaleOrdinal()
    .domain([1, 2, 3, 4])
    .range(["#004A8F", "#B01116", "#FAA916", "#6BA292"]);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xAxis = d3.axisBottom(xScale);

  const yAxis = d3.axisLeft(yScale)
    .tickValues(yAxisTicks)
    .tickFormat(d3.format('d'));

  const yAxisG = g.append('g').call(yAxis);

  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);

  const tooltip = d3.select('.line-tooltip');

  //y axis
  yAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', -40)
    .attr('x', -innerHeight / 2)
    .attr('fill', '#373739')
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .text(yAxisLabel)
    .style('font-size', '14px');

  // x axis
  xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', 40)
    .attr('x', innerWidth / 2)
    .attr('fill', '#373739')
    .text(xAxisLabel)
    .style('font-size', '14px');

  const lineGenerator = d3.line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)));
  //.curve(d3.curveBasis);

  const lastYValue = d =>
    yValue(d.values[d.values.length - 1]);

  const nested = d3.nest()
    .key(colorValue)
    .entries(d);

  colorScale.domain(nested.map(d => d.key));

  // lines
  var linesContainer = svg.append('g')
    .attr('class', 'lines-container')

  const lineGroup = linesContainer.selectAll(".line-group")
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .attr('class', d => `line-group ${d.key.toLowerCase().replaceAll(' ', '-').replaceAll('<br>', '-')}`);

  const path = lineGroup.append('path')
    .attr('class', 'line-path')
    .attr('d', d => lineGenerator(d.values))
    .attr('stroke', d => colorScale(d.key))
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .style('fill', 'none')
    .style('stroke-width', 5)
    .style('opacity', 0.7);

  // title
  d3.select('.line-wrapper .title')
    .text(title)
    .style('font-size', '18px');
  // g.append('text')
  //   .attr('class', 'title')
  //   .attr('y', -10)
  //   .text(title)
  //   .style('font-size', '18px');

  var bisectDate = d3.bisector(function(d) {
    return xScale(d.date) - margin.left;
  }).left

  var bisectType = d3.bisector(function(d) {
    return yScale(d.count) - (margin.bottom + margin.top);
  }).left

  // interactive logic
  msover = function(data) {
    var x0 = d3.mouse(event.target)[0],
      y0 = d3.mouse(event.target)[1],
      i = bisectDate(data, x0, 1),
      j = bisectType(data, y0, 1)

    var d0 = data[i - 1] !== 'dummy' ? data[i - 1] : data[i],
      d1 = i < data.length ? data[i] : data[i - 1]

    var d = (x0 + margin.left) - xScale(d0.date) > xScale(d1.date) - (x0 + margin.left) ? d1 : d0;

    if (d0 !== d1) {
      var selectDate = new Date(d.date)
      selectDate.setMonth(selectDate.getMonth() - 12)
    } else {
      var selectDate = d.date
    }
    var rawPoints = data.filter(d => d.date.getYear() === selectDate.getYear())
    var linePoints = {}
    rawPoints.forEach(d => linePoints[d.award] = d.count)

    var lineKeys = Object.keys(linePoints)
    var closestKey = lineKeys[0]

    for (let i = 1; i < lineKeys.length; i++) {
      closestKey = Math.abs(y0 - yScale(linePoints[closestKey])) < Math.abs(y0 - yScale(linePoints[lineKeys[i]])) ? closestKey : lineKeys[i]
    }

    d = rawPoints.filter(d => d.award === closestKey)[0]

    tooltip
      .style('opacity', 1)
      .style('background-color', colorScale(d.award));

    var offsetParent = document.querySelector(`.line-wrapper`).offsetParent
    var offY = offsetParent.offsetTop
    var cursorY = 5
    var ch = document.querySelector(`.line-tooltip`).clientHeight
    var cy = d3.event.pageY - offY

    var offX = offsetParent.offsetLeft
    var cursorX = 10
    var cx = d3.event.pageX - offX

    tooltip.html("<p style='margin: 5px 5px 0 5px; padding: 5px 5px 0 5px; font-weight: bold;'>" + d.award + "</p><p style='margin: 0 5px 5px 5px; padding: 0 5px 5px 5px;'>" + d.count + "</p>")
      .style('left', (cx + cursorX) + 'px')
      .style('top', (cy - 28) + 'px');

    var tag = '.' + d.award.toLowerCase().replaceAll(' ', '-').replaceAll('<br>', '-')
    const selection = d3.select(tag).raise();

    // selection.transition()
    //   .delay("20")
    //   .duration('200')
    //   .attr('r', 10)
    //   .style('fill-opacity', 1)
    //   .style('stroke-opacity', 1)
    //   .style('stroke', colorScale(d.award))
    //   .style('stroke-width', "5px")
    //   .style('fill', 'white');

    d3.selectAll('.line-point')
      .attr('r', 0)
      .style('fill-opacity', 0)
      .style('stroke-opacity', 0)
      .style('stroke', 'black')
      .style('stroke-width', 0)

    var circle = d3.select(tag + '-' + d.date.getFullYear())
      .attr('r', 8)
      .style('fill-opacity', 1)
      .style('stroke-opacity', 1)
      .style('stroke', 'black')
      .style('stroke-width', 1)
      .style('fill', colorScale(d.award));
  };

  msout = function() {
    tooltip.style('opacity', 0);

    d3.selectAll('.line-point')
      .attr('r', 0)
      .style('fill-opacity', 0)
      .style('stroke-opacity', 0)
      .style('stroke', 'black')
      .style('stroke-width', 0)
    //
    // selection.transition()
    //   .delay("20")
    //   .duration('200')
    //   .attr('r', 20)
    //   .style('fill-opacity', 0)
    //   .style('stroke-opacity', 0);
  };

  svg.append('rect')
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("class", "hover-overlay")
    .attr("width", innerWidth)
    .attr("height", innerHeight)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .data([d])
    .on("mouseover mousemove touchstart touchmove", function(data) {
      return msover(data)
    })
    .on("mouseout", msout);

  // points
  lineGroup.selectAll('line-point')
    .data(d => d.values)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.date))
    .attr('cy', d => yScale(d.count))
    .attr('r', 20)
    .attr('class', (d) => {
      var award = d.award.toLowerCase().replaceAll(' ', '-').replaceAll('<br>', '-')
      var year = d.date.getFullYear()
      return `${award}-${year} line-point`
    })
    .style('fill-opacity', 0)
    .style('stroke-opacity', 0)
  // events
  // .on('mouseover', msover)
  // .on('mousemove', msmove)
  // .on('mouseout', msout);
}

function updateBar(d, t) {
  d3.selectAll(".bar-chart > *").remove();

  const svg = d3.select('.bar-chart');
  const width = window.innerWidth < 768 ? window.innerWidth : 640;
  const height = window.innerWidth < 768 ? 350 : 500;
  const title = "Top award-winning practice areas for the firm " + t;
  const xValue = d => d.practice;
  const xAxisLabel = "Practice area";
  const yValue = d => d.count;
  const yAxisLabel = "Number of awards won";
  const margin = {
    top: 25,
    right: 50,
    bottom: 50,
    left: 50
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  var countarr = new Array();
  for (let i = 0; i < d.length; i++) {
    countarr.push(d[i].count);
  }

  const xScale = d3.scaleBand()
    .domain(d.map(function(d) {
      return d.practice
    }))
    .range([0, innerWidth])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, 40])
    //Was max, now constant max for easy comparison between firms,
    //need to programatically change, or check Gibson Dunn's max
    .rangeRound([innerHeight, 0])
    .nice();

  const yAxisTicks = yScale.ticks()
    .filter(tick => Number.isInteger(tick));

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const barGroup = svg.selectAll(".bar-group")
    .data(d)
    .enter()
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .attr('class', 'bar-group');

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d => d === '' ? 'N/A' : d)

  const yAxis = d3.axisLeft(yScale)
    .tickValues(yAxisTicks)
    .tickFormat(d3.format('d'));

  const yAxisG = g.append('g').call(yAxis);

  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);

  //y axis
  yAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', -40)
    .attr('x', -innerHeight / 2)
    .attr('fill', '#373739')
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .text(yAxisLabel)
    .style('font-size', '14px');

  // x axis
  xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', 40)
    .attr('x', innerWidth / 2)
    .attr('fill', '#373739')
    .text(xAxisLabel)
    .style('font-size', '14px');

  const barText = barGroup.append('text')
    .attr('class', 'bar-text')
    .attr("x", function(d) {
      return xScale(d.practice) + (xScale.bandwidth() / 2);
    })
    .attr("y", function(d) {
      return yScale(d.count) - 10;
    })
    .text(function(d) {
      return d.count;
    })
    .style("text-anchor", "middle")
    .style("text-align", "center")
    .style('fill', 'black')
    .style('opacity', 1)
    .style('font-size', '20px');

  // bars
  barGroup.append("rect")
    .attr("class", "bar-path")
    .attr("x", function(d) {
      return xScale(d.practice);
    })
    .attr("y", function(d) {
      return yScale(d.count);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) {
      return innerHeight - yScale(d.count);
    })
    .attr("fill", "#654F6F")
    .attr('fill-opacity', 1)
  // .on('mouseover', function(d) {
  //   const selection = d3.select(this).lower();
  //
  //   selection.transition()
  //     .delay("20")
  //     .duration('200')
  //     .attr('fill-opacity', 0.7);
  //
  //   barText.transition()
  //     .delay(30)
  //     .duration(0)
  //     .style('opacity', 1);
  // })
  // .on('mouseout', function(d) {
  //   const selection = d3.select(this).raise();
  //
  //   selection.transition()
  //     .delay("20")
  //     .duration('200')
  //     .attr('fill-opacity', 1);
  //
  //   barText.transition()
  //     .delay(30)
  //     .duration(0)
  //     .style('opacity', 0);
  // });

  // title
  d3.select('.bar-wrapper .title')
    .text(title)
    .style('font-size', '18px');
  // g.append('text')
  //   .attr('class', 'title')
  //   .attr('y', -10)
  //   //.attr('x', width / 2)
  //   .text(title)
  //   .style('font-size', '18px');
}

// on clicking a firm, aggregate data for viz
$(document).ready(function() {
  $(".dropdown-firm-content").on("click", "p", function(event) {
    subset = new Array();
    aggdata = new Array();
    aggbar = new Array();

    for (let i = 0; i < globaldata.length; i++) {
      if (globaldata[i].firm.indexOf($(this).text()) > -1) {
        subset.push(globaldata[i]);
      };
    };

    // line chart aggregation
    for (let i = 2010; i <= 2021; i++) {
      var aggdata_row0 = new Object();
      var aggdata_row1 = new Object();
      var aggdata_row2 = new Object();
      var aggdata_row3 = new Object();
      currentDate = new parseDate(i);
      aggdata_row0['date'] = currentDate;
      aggdata_row1['date'] = currentDate;
      aggdata_row2['date'] = currentDate;
      aggdata_row3['date'] = currentDate;
      var MVP = 0;
      var Titan = 0;
      var PG = 0;
      var RS = 0;
      for (let x = 0; x < subset.length; x++) {
        if (subset[x].date.indexOf(i.toString()) > -1) {
          if (subset[x].award.indexOf("MVP") > -1) {
            MVP += 1;
          } else if (subset[x].award.indexOf("Titans Of The Plaintiffs Bar") > -1) {
            Titan += 1;
          } else if (subset[x].award.indexOf("Rising Stars") > -1) {
            RS += 1;
          } else {
            PG += 1;
          }
        }
      }
      aggdata_row0["award"] = "MVP";
      aggdata_row1["award"] = "Titans of the<br>Plaintiffs Bar";
      aggdata_row2['award'] = "Practice Groups<br>of the Year";
      aggdata_row3['award'] = "Rising Stars";

      aggdata_row0["count"] = MVP;
      aggdata_row1["count"] = Titan;
      aggdata_row2['count'] = PG;
      aggdata_row3['count'] = RS;

      aggdata.push(aggdata_row0);
      aggdata.push(aggdata_row1);
      aggdata.push(aggdata_row2);
      aggdata.push(aggdata_row3);
    };
    updateLine(d = aggdata, t = $(this).text());

    // bar chart aggregation
    seenPractice = new Object();
    for (let i = 0; i < subset.length; i++) {
      for (let x = 0; x < subset[i].practice.length; x++) {
        let tmp1 = subset[i].practice[x];
        if (!Object.keys(seenPractice).includes(tmp1)) {
          seenPractice["{}".replace("{}", tmp1)] = 1;
        } else {
          seenPractice["{}".replace("{}", tmp1)] += 1;
        }
      }
    };
    var sortable = [];
    for (var key in seenPractice) {
      if (seenPractice.hasOwnProperty(key)) {
        sortable.push([key, seenPractice[key]]);
      }
    }
    sortable.sort(function(a, b) {
      return b[1] - a[1];
    });
    var subsort = sortable.slice(0, 5);
    var subsort2 = new Array();
    for (let i = 0; i < subsort.length; i++) {
      var subsort3 = new Object();
      subsort3['practice'] = subsort[i][0];
      subsort3['count'] = subsort[i][1];
      subsort2.push(subsort3);
    };
    updateBar(d = subsort2, t = $(this).text());
  });
});