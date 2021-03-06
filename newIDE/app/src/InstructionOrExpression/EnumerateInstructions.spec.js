// @flow
import { createTree } from './CreateTree';
import {
  enumerateInstructions,
  getObjectParameterIndex,
} from './EnumerateInstructions';

describe('EnumerateInstructions', () => {
  it('can enumerate instructions being conditions', () => {
    const instructions = enumerateInstructions(true);

    // Test for the proper presence of a few conditions
    expect(instructions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          displayedName: 'Animation finished',
          fullGroupName: 'Sprite/Animations and images',
          type: 'AnimationEnded',
        }),
        expect.objectContaining({
          displayedName: 'Trigger once while true',
          fullGroupName: 'Advanced',
          type: 'BuiltinCommonInstructions::Once',
        }),
        expect.objectContaining({
          displayedName: 'The cursor/touch is on an object',
          fullGroupName: 'Mouse and touch',
          type: 'SourisSurObjet',
        }),
      ])
    );
  });

  it('can enumerate instructions being actions', () => {
    const instructions = enumerateInstructions(false);

    // Test for the proper presence of a few actions
    expect(instructions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          displayedName: 'Start (or reset) a scene timer',
          fullGroupName: 'Timers and time',
          type: 'ResetTimer',
        }),
        expect.objectContaining({
          displayedName: 'Rotate',
          fullGroupName: 'Common actions for all objects/Angle',
          type: 'Rotate',
        }),
      ])
    );
  });

  it('can create the tree of instructions', () => {
    const instructions = enumerateInstructions(true);
    expect(createTree(instructions)).toMatchObject({
      Advanced: {
        'Trigger once while true': {
          displayedName: 'Trigger once while true',
          fullGroupName: 'Advanced',
          type: 'BuiltinCommonInstructions::Once',
        },
      },
      Audio: {
        'Global volume': {
          displayedName: 'Global volume',
          fullGroupName: 'Audio',
          type: 'GlobalVolume',
        },
      },
    });
  });

  it('can find the object parameter, if any', () => {
    const actions = enumerateInstructions(false);
    const conditions = enumerateInstructions(true);

    const createInstruction = actions.filter(
      ({ type }) => type === 'Create'
    )[0];
    expect(createInstruction).not.toBeUndefined();
    expect(getObjectParameterIndex(createInstruction.metadata)).toBe(1);

    const pickRandom = actions.filter(({ type }) => type === 'AjoutHasard')[0];
    expect(pickRandom).not.toBeUndefined();
    expect(getObjectParameterIndex(pickRandom.metadata)).toBe(1);

    const pickAll = actions.filter(({ type }) => type === 'AjoutObjConcern')[0];
    expect(pickAll).not.toBeUndefined();
    expect(getObjectParameterIndex(pickAll.metadata)).toBe(1);

    const triggerOnce = conditions.filter(
      ({ type }) => type === 'BuiltinCommonInstructions::Once'
    )[0];
    expect(triggerOnce).not.toBeUndefined();
    expect(getObjectParameterIndex(triggerOnce.metadata)).toBe(-1);

    const spriteAnimatedEnded = conditions.filter(
      ({ type }) => type === 'AnimationEnded'
    )[0];
    expect(spriteAnimatedEnded).not.toBeUndefined();
    expect(getObjectParameterIndex(spriteAnimatedEnded.metadata)).toBe(0);
  });
});
