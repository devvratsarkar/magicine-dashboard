
//Timeline
export const timeline = [
  {id:1, icon:'fa-user-plus', color:'primary',data:'Mr John', data1:'Started following you', data2:'01 June 2020', data3:'1min', color1:'primary'},
  {id:2, icon:'fa-comment', color:'secondary',data:'Lily 1 ', data1:' Commented applied', data2:'01 July 2020', data3:'3min', color1:'danger'},
  {id:3, icon:'fa-thumbs-up', color:'success',data:'Kevin', data1:' liked your site', data2:'05 July 2020', data3:'5min', color1:'warning'},
  {id:4, icon:'fa-envelope', color:'info',data:'Andrena', data1:' posted a new article', data2:'09 October 2020', data3:'5min', color1:'info'},
  {id:5, icon:'fa-shopping-bag', color:'danger',data:'Sonia', data1:' Delivery in progress', data2:'12 October 2020', data3:'5min', color1:'warning'},
]
 
//Browser usage
export const browser = [
  {id:1, icon:'fa-chrome bg-secondary-gradient text-white', heading:'Chrome',data:'35,50', data1:'fe fe-arrow-up', data2:'12.75%', color:'success'},
  {id:2, icon:'fa-opera text-white bg-danger-gradient', heading:'Opera',data:'12,563', data1:'fe fe-arrow-down', data2:'15.12%', color:'danger'},
  {id:3, icon:'fa-firefox text-white bg-purple-gradient', heading:'IE',data:'25,364', data1:'fe fe-arrow-up', data2:'24.37%', color:'success'},
  {id:4, icon:'fa-edge text-white bg-info-gradient', heading:'Firefox',data:'14,635', data1:'fe fe-arrow-up', data2:'15,63%', color:'success'},
  {id:5, icon:'fa-android text-white bg-success-gradient', heading:'Android',data:'15,453', data1:'fe fe-arrow-down', data2:'23.70%', color:'danger'},
]


  //totalTransactions
  export const totalTransactions = {
    series: [{
      name: "Total Orders",
      type: 'line',
      data:[0, 45, 30, 75, 15, 94, 40, 115, 30, 105, 65, 110]
      
    },{
      name: "Total Sales",
      type: 'line',
      data: [0, 60, 20, 130, 75, 130, 75, 140, 64, 130, 85, 120]
      
    }, {
      name: "",
      type: 'area',
      data: [0, 105, 70, 175, 85, 154, 90, 185, 120, 145, 185, 130]
    }],
  
    options: {
      chart: {
        height: 300,
        type: "line",
        stacked: false,
      
        dropShadow: {
          enabled: true,
          opacity: 0.1,
        },
      },
      colors: ["#6259ca", "#f99433", 'rgba(119, 119, 142, 0.01)'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: [3, 3, 0],
        dashArray: [0, 4],
        lineCap: "round"
      },
      grid: {
        padding: {
          left: 0,
          right: 0
        },
        strokeDashArray: 3
      },
      markers: {
        size: 0,
        hover: {
          size: 0
        }
      },
    
      xaxis: {
        type: "month",
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        axisBorder: {
          show: false,
          color: 'rgba(119, 119, 142, 0.08)',
        },
        labels: {
          style: {
            color: '#8492a6',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            color: '#8492a6',
            fontSize: '12px',
          },
        },
        axisBorder: {
          show: false,
          color: 'rgba(119, 119, 142, 0.08)',
        },
      },
      fill: {
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: "vertical",
          opacityFrom: 0.95,
          opacityTo: 0.45,
          stops: [0, 100, 100, 100]
        }
        },
      tooltip: {
        show:false
      },
      legend: {
        position: "top",
        show:true
      }
    },
   
  };


  export const Recentorders = {
    series: [83],
    options: {
      chart: {
        height: 305,
        type: "radialBar",
        responsive:'true',
        offsetY: 10,
        offsetX: 0,
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: "16px",
              color: undefined,
              offsetY: 30,
            },
            value: {
              offsetY: -16,
              fontSize: "22px",
              color: undefined,
              formatter: function (val) {
                return val + "%";
              },
            },
          },
        },
      },
      colors: ['#ff5d9e'],
    fill: {
      type: "gradient",
      gradient: {
        shade: "gradient",
        type: "horizontal",
        shadeIntensity: .5,
        gradientToColors: ['#6259ca'],
        inverseColors: !0,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
      stroke: {
        dashArray: 4,
      },
      labels: [""],
    },
  };

