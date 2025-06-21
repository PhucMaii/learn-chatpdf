import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'

export default function LineChart() {
    const [state, setState] = useState<any>({
          
        series: [
          {
            name: "Quiz Attempts",
            data: [28, 29, 33, 36, 32, 32, 33]
          },
        ],
        options: {
          chart: {
            height: 350,
            type: 'line',
            dropShadow: {
              enabled: true,
              color: '#000',
              top: 18,
              left: 7,
              blur: 10,
              opacity: 0.5
            },
            zoom: {
              enabled: false
            },
            toolbar: {
              show: false
            }
          },
          colors: ['#77B6EA', '#545454'],
          dataLabels: {
            enabled: true,
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'Attemp Performance',
            align: 'left'
          },
          grid: {
            borderColor: '#e7e7e7',
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          markers: {
            size: 1
          },
          xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            title: {
              text: 'Month'
            }
          },
          yaxis: {
            title: {
              text: 'Temperature'
            },
            min: 5,
            max: 40
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
          }
        },
      
      
    });
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