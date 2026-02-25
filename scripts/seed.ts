import { initDb, addQuestion } from '../src/db.js';

const questions = [
  { paper_type: 'paper1', content: 'Explain the concept of opportunity cost using a production possibility curve diagram.' },
  { paper_type: 'paper1', content: 'Distinguish between a movement along a demand curve and a shift of the demand curve.' },
  { paper_type: 'paper2sl', content: 'Using a diagram, explain how a subsidy granted to producers of a good affects the market equilibrium.' },
  { paper_type: 'paper2hl', content: 'Discuss the view that the best way to reduce a current account deficit is to increase the value of the currency.' },
  { paper_type: 'paper3hl', content: 'Calculate the price elasticity of demand when the price increases from $10 to $12 and the quantity demanded decreases from 100 to 80 units.' },
];

async function seed() {
  await initDb();
  
  for (const q of questions) {
    try {
      await addQuestion(q.paper_type, q.content);
    } catch (e) {
      console.error('Error inserting question:', e);
    }
  }

  console.log('Database seeded successfully!');
}

seed();
