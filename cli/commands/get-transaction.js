const axios = require("axios").default;
const ora = require("ora");
const { program } = require("../config/config");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");
var Table = require("cli-table");
const bigNumber = require("big.js");
var pretty = require('js-object-pretty-print').pretty;

const shards = [
  "https://rosetta.s0.b.hmny.io",
  "https://rosetta.s1.b.hmny.io",
  "https://rosetta.s2.b.hmny.io",
  "https://rosetta.s3.b.hmny.io",
];
function getBlock() {
  var questions = [
    {
      type: "input",
      name: "block_identifier",
      message: "Please enter the block identifer hash?",
      validate: function (val) {
        if (val) {
          return true;
        } else {
          return "Please enter a valid block identifier";
        }
      },
    },
    {
      type: "input",
      name: "block_index",
      message: "Please enter the block identifer index?",
      validate: function (val) {
        if (val > 0) {
          return true;
        } else {
          return "Please enter a valid block identifer index";
        }
      },
    },
    {
      type: "input",
      name: "transaction_identifier",
      message: "Please enter the transaction identifer?",
      validate: function (val) {
        if (val) {
          return true;
        } else {
          return "Please enter a valid blotransactionck identifer!!";
        }
      },
    },
    {
      type: "list",
      name: "chain",
      message: "What chain would you like to query?",
      choices: ["Testnet", "Mainnet"],
      filter: function (val) {
        return val;
      },
    },
    {
      type: "list",
      name: "shardNo",
      message: "What shard number would you like to connect to?",
      choices: ["0", "1", "2", "3"],
      filter: function (val) {
        return val.toLowerCase();
      },
    },
    {
      type: "list",
      name: "isBeacon",
      message: "Is this a beacon chain?",
      choices: ["true", "false"],
      filter: function (val) {
        return val;
      },
    },
  ];

  inquirer.prompt(questions).then((options) => {
    const spinner = ora(
      `Fetching block details for ${options.block_identifier} on the Harmony Blockchain Network....\n`
    ).start();
    axios({
      method: "POST",
      url: shards[options.shardNo] + "/block",
      data: {
        network_identifier: {
          blockchain: "Harmony",
          network: options.chain,
          sub_network_identifier: {
            network: "shard " + options.shardNo,
            metadata: {
              is_beacon: options.isBeacon === "true" ? true : false,
            },
          },
        },
        transaction_identifier: {
          hash: options.transaction_identifier,
        },
        block_identifier: {
          index: parseInt(options.block_index),
          hash: options.block_identifier,
        },
      },
    })
      .then((results) => {
        if (results.data.hasOwnProperty("block")) {
          spinner.succeed(
            `Fetching Transaction details from block hash ${options.block_identifier} on the Harmony Blockchain Network results will be shown as JSON....\n`
          );
          console.log(chalk.yellow("Current Block Data JSON\n"));
          console.log(chalk.greenBright(pretty(results.data)));
          //  console.log(chalk.yellow("\nCurrent User Balances in One"));
          // console.log(tableBalances.toString());
        } else {
          spinner.succeed(
            "Couldnt connect to the Rosetta SDK Servers please try again\n"
          );
        }
        spinner.stop();
        process.exit(0);
      })
      .catch((error) => {
        console.log("error: ", error);
        spinner.succeed(
          "Couldnt connect to the Rosetta SDK Servers please try again\n"
        );
        spinner.stop();
        process.exit(0);
      });
  });
}

getBlock();
