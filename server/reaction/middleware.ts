import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReactionCollection from './collection';

/**
 * Checks if a reaction with reactionId is req.params exists
 */
const isReactionExists = async (req: Request, res: Response, next: NextFunction) => {
  var reactId= req.body.reactionId;
  console.log("isreactionexists");
  console.log(reactId);
  if (reactId == undefined){
    console.log(req.body, req.params, req.query);
    reactId =req.params.reactionId;
  }
  console.log(reactId);
  const validFormat = Types.ObjectId.isValid(reactId);
  console.log(validFormat);
  const reaction = validFormat ? await ReactionCollection.findOne(reactId) : '';
  console.log(reaction);
  if (!reaction) {
    res.status(404).json({
      error: {
        reactionNotFound: `Reaction with reaction ID ${reactId} does not exist.`
      }
    });
    return;
  }
  console.log("passed isreactionexists");
  next();
};


/**
 * Checks if the current user is the author of the reaction whose reactionId is in req.params
 */
const isValidReactionModifier = async (req: Request, res: Response, next: NextFunction) => {
  console.log("isvalidreactionmodifier");
  var reactId=  req.params.reactionId? req.params.reactionId : req.body.reactionId;
  const reaction = await ReactionCollection.findOne(reactId);
  if (!reaction) { //check reaction exists
    res.status(404).json({
      error: {
        reactionNotFound: `Reaction with reaction ID ${req.params.reactionId} does not exist.`
      }
    });
    return;
  }
  console.log("validreaction modifer confirmed that reaction exists")
  const userId = reaction.UserId._id;
  if (req.session.userId !== userId.toString()) { // check user is the one who made reaction
    res.status(403).json({
      error: 'Cannot modify other users\' reactions.'
    });
    return;
  }

  next();
  console.log("passed isvalidreactionmodifier");
};
/**
 * Checks if the reaction is a valid option (-1, 0, 1)
 * Raiser error 403 if no input
 * Raises error 403 if not 
 */
const isValidReaction =async (req: Request, res:Response, next: NextFunction) => {
  console.log("isValidReaction");
  console.log(req.param);
  console.log(req.body);
  console.log(req.query);
  const input = req.body.vote? req.body.vote : req.query.vote;
  console.log('input', input);
  // console.log(req.params);
  // console.log(parseInt(input));
  if (parseInt(input)!==0 && parseInt(input)!==1 && parseInt(input)!==-1 ){
    res.status(403).json({
      error: 'The only valid reactions are -1, 0, and 1. Cannot parse invalid reaction value.'
    });
    return;
  }
  next();
  
}
export {
  isReactionExists,
  isValidReactionModifier,
  isValidReaction
};
