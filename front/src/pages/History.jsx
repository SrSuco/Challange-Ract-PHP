import Styles from './History.module.css'
import HistoryTable from './History/HistoryTable'

function History () {
	return (
	<div className={Styles.HistoryTable}>
		<HistoryTable />
	</div>
	)
}

export default History