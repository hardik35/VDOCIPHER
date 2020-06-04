<script>
import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  props: ['chartData', 'options'],
    mounted () {
        this.renderChart(this.chartData, this.options)
    },
    methods: {
        updateLabels() {
            this.$data._chart.update();
        },
        updateStepSize() {
            this.renderChart(this.chartData, this.options);
        }
    }
}
</script>

<style>
</style>