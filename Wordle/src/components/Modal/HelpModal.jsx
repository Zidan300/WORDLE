import { Modal } from './Modal'

function Example({ letters, state }) {
  return <div className="help-example">{letters.split('').map((letter, index) => <span className={index === 0 ? `example-${state}` : ''} key={letter}>{letter}</span>)}</div>
}

export function HelpModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to play">
      <div className="help-modal">
        <span className="modal-kicker">HOW IT WORKS</span>
        <h2>A little word ritual</h2>
        <p>Find the five-letter word in six tries. Each guess offers a hint.</p>
        <div className="help-list">
          <div><Example letters="SHINE" state="correct" /><p><b>S</b> is in the word and in the right place.</p></div>
          <div><Example letters="PLANT" state="present" /><p><b>P</b> is in the word, but belongs elsewhere.</p></div>
          <div><Example letters="MIRTH" state="absent" /><p><b>M</b> does not appear in the word.</p></div>
        </div>
        <p className="help-tip">Use your keyboard or the floating keys below the board. Press Enter to submit.</p>
      </div>
    </Modal>
  )
}
