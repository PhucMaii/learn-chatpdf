import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react'
import ReactApexChart from 'react-apexcharts'

export default function LineChart({
    seriesData,
    horizontalAxis,
}: {
    seriesData: any;
    horizontalAxis: any;
}) {
    const [state, setState] = useState<any>({
        series: [
          {
            name: "Score",
            data: []
          },
        ],
        options: {
          chart: {
            height: 350,
            type: 'line',
            dropShadow: {
              enabled: true,
              color: '#3B82F6',
              top: 8,
              left: 4,
              blur: 15,
              opacity: 0.3
            },
            zoom: {
              enabled: false
            },
            toolbar: {
              show: false
            },
            background: 'transparent',
            foreColor: '#374151'
          },
          colors: ['#3B82F6'],
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '12px',
              fontWeight: '600',
              colors: ['#1F2937']
            },
            background: {
              enabled: true,
              foreColor: '#FFFFFF',
              borderRadius: 4,
              borderWidth: 0,
              opacity: 0.9,
              dropShadow: {
                enabled: false
              }
            }
          },
          stroke: {
            curve: 'smooth',
            width: 3,
            colors: ['#3B82F6']
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              type: 'vertical',
              shadeIntensity: 0.3,
              gradientToColors: ['#60A5FA'],
              inverseColors: false,
              opacityFrom: 0.8,
              opacityTo: 0.1,
              stops: [0, 100]
            }
          },
          title: {
            text: 'Performance Over Time',
            align: 'left',
            style: {
              fontSize: '18px',
              fontWeight: '600',
              color: '#1F2937'
            }
          },
          grid: {
            borderColor: '#E5E7EB',
            strokeDashArray: 4,
            row: {
              colors: ['transparent', 'transparent'],
              opacity: 0.1
            },
            column: {
              colors: ['transparent', 'transparent'],
              opacity: 0.1
            }
          },
          markers: {
            size: 6,
            colors: ['#3B82F6'],
            strokeColors: '#FFFFFF',
            strokeWidth: 2,
            hover: {
              size: 8,
              sizeOffset: 2
            }
          },
          xaxis: {
            categories: [],
            title: {
              text: 'Date',
              style: {
                fontSize: '14px',
                fontWeight: '500',
                color: '#6B7280'
              }
            },
            labels: {
              style: {
                colors: '#6B7280',
                fontSize: '12px'
              }
            },
            axisBorder: {
              color: '#E5E7EB'
            },
            axisTicks: {
              color: '#E5E7EB'
            }
          },
          yaxis: {
            title: {
              text: 'Score (%)',
              style: {
                fontSize: '14px',
                fontWeight: '500',
                color: '#6B7280'
              }
            },
            labels: {
              style: {
                colors: '#6B7280',
                fontSize: '12px'
              },
              formatter: function(val: number) {
                return val.toFixed(0) + '%';
              }
            },
            min: 0,
            max: 100,
            tickAmount: 5
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5,
            labels: {
              colors: '#6B7280'
            },
            markers: {
              width: 12,
              height: 12,
              radius: 6
            }
          },
          tooltip: {
            theme: 'light',
            style: {
              fontSize: '12px'
            },
            y: {
              formatter: function(val: number) {
                return val.toFixed(1) + '%';
              }
            }
          },
          responsive: [{
            breakpoint: 768,
            options: {
              chart: {
                height: 250
              },
              dataLabels: {
                enabled: false
              }
            }
          }]
        },
    });

    // Update chart data when props change
    useEffect(() => {
        setState({
            series: [
                {
                    name: "Score",
                    data: seriesData || []
                },
            ],
            options: {
                ...state.options,
                xaxis: {
                    ...state.options.xaxis,
                    categories: horizontalAxis || []
                }
            }
        });
    }, [seriesData, horizontalAxis]);

    return (
        <div>
            <ReactApexChart 
                options={state.options as ApexOptions} 
                series={state.series} 
                type="line"
                height={350}
            />
        </div>
    )
}