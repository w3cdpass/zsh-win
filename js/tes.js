import ora from 'ora';
import chalk from 'chalk';

// Initialize the spinner with the specified frames
const spinner = ora({
    text: `Loading ${chalk.red('unicorns')}`,
    spinner: {
        frames: [
            '◜', '◝', '◞', '◟',
            '◜', '◝', '◞', '◟'
        ],
        interval: 100
    }
}).start();

// Array of messages for each round
const messages = [
    `Loading ${chalk.red('unicorns')}`,
    `Finding ${chalk.blue('rainbows')}`,
    `Searching for ${chalk.green('dragons')}`,
    `Collecting ${chalk.yellow('stars')}`,
    `Exploring ${chalk.magenta('galaxies')}`,
    `Discovering ${chalk.cyan('planets')}`
];

let rounds = 0;
const totalRounds = messages.length; // Use the length of the messages array

const updateSpinner = () => {
    if (rounds < totalRounds) {
        // Update spinner text and increment round count
        setTimeout(() => {
            spinner.text = messages[rounds];
            rounds++;
            updateSpinner(); // Continue the process
        }, 1500); // Duration of each round
    } else {
        // Final message when all rounds are complete
        spinner.succeed('All tasks completed!');
    }
};

// Start updating the spinner
updateSpinner();

