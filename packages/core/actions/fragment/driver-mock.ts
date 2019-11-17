import { MockFragment } from '../../mocks/mockFragment';
import { MockNode } from '../../mocks/mockNode';
import { FragmentDriver, FragmentType } from './index';

export const fragmentDriverMock: FragmentDriver<MockNode, MockFragment> = {
    [FragmentType]: (_, { children }) =>
        new MockFragment(children)
}