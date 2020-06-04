<template>
    <div id="userStatisticsGraph">
        <div 
            v-for="(value, name, index) in allChartsData"
            :key="index"
            >
            <div v-if="value.loaded">
                <component
                    :ref="name" 
                    :is="value.chartType"
                    :chartData="value.chartData"
                    :options="value.options"
                />
                <div>
                    <span>Change Step Size</span>
                    <input 
                        v-model.number="value.options.scales.yAxes[0].ticks.stepSize"
                        @input="updateStepSize(name)"/>
                </div>
                <div>
                    <span>Change Labels Gap</span>
                    <input 
                        v-model.number="value.labelGap"
                        @input="updateLabelGap(name)"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import API from '../services/api/index.js';
import barGraph from './barGraph.vue';

export default {
    name: "userStatisticsGraph",
    components: {
      barGraph,
    },
    data() {
        return {
            allChartsData: {
                postsChartData: {
                    loaded: false,
                    totalSlabs: '',
                    chartType: 'barGraph',
                    wordCount: [],
                    labelGap: 500,
                    lastLabelLoweLimit: 5000,
                    chartData: {
                        labels: [],
                        datasets: [
                            {
                                label: 'Posts Word Count',
                                backgroundColor: 'blue',
                                data: []
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 5,
                                }
                            }]
                        }
                    },
                },
                pagesChartData: {
                    loaded: false,
                    totalSlabs: '',
                    chartType: 'barGraph',
                    wordCount: [],
                    labelGap: 100,
                    lastLabelLoweLimit: 2000,
                    chartData: {
                        labels: [],
                        datasets: [
                            {
                                label: 'Pages Word Count',
                                backgroundColor: 'blue',
                                data: []
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 10,
                                }
                            }]
                        }
                    },
                }
            },
        };
    },
    methods: {
        async fetchChartDetails(chartName) {
            this.setTotalSlabs(chartName);
            this.generateLabels(chartName);
            let chartData = [];
            if (chartName === 'postsChartData') {
                chartData = (await API.postsDetails.FETCH_POSTS_DETAILS()).data;
            }
            if (chartName === 'pagesChartData') {
                chartData = (await API.pagesDetails.FETCH_PAGES_DETAILS()).data;
            }
            this.setWordCountChartData(chartData, chartName);
            this.generateWordCountCorrespondingLabel(chartName);
            this.allChartsData[chartName].loaded = true;
        },
        setWordCountChartData(chartDataArray, chartName) {
            chartDataArray.forEach(post => {
                // regex to remove all the html tags and line breaks
                let wordCount = post.content.rendered.replace(/<[^>]*>/g," ").replace(/\s+/g, ' ').trim().split(' ').length
                this.allChartsData[chartName].wordCount.push(wordCount);
            });
        },
        getIndexForDatasetsLabel(count, chartName) {
            let totalSlabs = this.allChartsData[chartName].totalSlabs;
            // retrieve index on which the word count corresponsing to label is to be pushed
            for (let i = 0; i < totalSlabs; i++) {
                if (count <= this.allChartsData[chartName].labelGap * (i + 1)){
                    return i;
                }
                if (i === totalSlabs - 1) {
                    // if wordcount belongs to last slab 
                    return i;
                }
            }
        },
        generateWordCountCorrespondingLabel(chartName) {
            let totalSlabs = this.allChartsData[chartName].totalSlabs;
            // generate array equal to total slabs with pre-filled 0
            let tempDatasets = new Array(totalSlabs).fill(0);
            this.allChartsData[chartName].wordCount.forEach(count => {
                tempDatasets[this.getIndexForDatasetsLabel(count, chartName)] += 1;
            });
            this.allChartsData[chartName].chartData.datasets[0].data = [...tempDatasets];
        },
        generateLabels(chartName) {
            let tempChartDataLabels = [];
            let totalSlabs = this.allChartsData[chartName].totalSlabs;
            for (let i = 0; i < totalSlabs; i++) {
                if (i + 1 < totalSlabs) {
                    tempChartDataLabels.push(`${(i*this.allChartsData[chartName].labelGap) + 1}-${(i+1)*this.allChartsData[chartName].labelGap}`);
                }
                else {
                    // last slab naming with infinity
                    tempChartDataLabels.push(`${(i*this.allChartsData[chartName].labelGap) + 1}-infinity`);    
                }
            }
            this.allChartsData[chartName].chartData.labels = [...tempChartDataLabels];
        },
        updateStepSize(chartName) {
            this.$refs[chartName][0].updateStepSize();
        },
        updateLabelGap(chartName) {
            this.setTotalSlabs(chartName);
            this.generateLabels(chartName);
            this.generateWordCountCorrespondingLabel(chartName);
            this.$refs[chartName][0].updateLabels();
        },
        setTotalSlabs(chartName) {
            this.allChartsData[chartName].totalSlabs = Math.ceil(this.allChartsData[chartName].lastLabelLoweLimit/this.allChartsData[chartName].labelGap) + 1;
        }
    },
    mounted() {
        this.fetchChartDetails('postsChartData');
        this.fetchChartDetails('pagesChartData');
    },
};
</script>
