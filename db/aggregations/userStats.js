const User = require('../models/User');

const getUserStats = async () => {
  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          usersByDomain: {
            $push: {
              $arrayElemAt: [
                { $split: ['$email', '@'] },
                1
              ]
            }
          }
        }
      },
      {
        $project: {
          totalUsers: 1,
          domainStats: {
            $reduce: {
              input: '$usersByDomain',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $literal: {
                      $concat: ['$$this', ': 1']
                    }
                  }
                ]
              }
            }
          }
        }
      }
    ];

    const result = await User.aggregate(pipeline);
    return result[0] || { totalUsers: 0, domainStats: {} };
  } catch (error) {
    console.error('Error in user stats aggregation:', error);
    throw error;
  }
};

module.exports = { getUserStats };
