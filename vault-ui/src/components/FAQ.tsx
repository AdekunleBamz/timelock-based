import './FAQ.css';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How does the timelock vault work?',
    answer: 'Deposits are locked for a specified period. Once the lock period expires, you can withdraw your funds plus any earned rewards.',
  },
  {
    question: 'Can I withdraw early?',
    answer: 'Early withdrawals are not permitted. Your funds remain locked until the specified unlock time.',
  },
  {
    question: 'How are rewards calculated?',
    answer: 'Rewards are calculated based on your deposit amount, lock duration, and the current APY rate.',
  },
  {
    question: 'What fees are involved?',
    answer: 'You only pay gas fees for transactions. There are no deposit or withdrawal fees.',
  },
  {
    question: 'Is my deposit secure?',
    answer: 'Yes, all smart contracts are audited and your funds are secured by blockchain technology.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => toggle(index)}>
              <span>{item.question}</span>
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </button>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
