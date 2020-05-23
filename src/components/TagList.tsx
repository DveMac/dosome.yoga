import { Tag as Label, TagLabel } from '@chakra-ui/core';
import Link from 'next/link';
import { Tag } from '../../types';
import { buildUrl } from '../lib/utils';

type TagListProps = {
  tags: string[];
  noLinks?: boolean;
  duration?: number;
  selected?: string | string[];
  displayLimit?: number;
};

export const TagLinksList: React.FC<TagListProps> = ({ tags, selected, duration, noLinks, displayLimit = 100 }) => {
  const multi = Array.isArray(selected);
  const isSelected = (tag: string) => (multi ? selected.indexOf(tag) >= 0 : selected === tag);

  return (
    <>
      {tags.slice(0, displayLimit).map((tag) => {
        const checked = isSelected(tag);
        return noLinks || !duration ? (
          <Label key={tag} size={'sm'} variantColor={checked ? 'green' : 'gray'} marginRight="1" marginTop="1">
            <TagLabel key={tag}>{tag}</TagLabel>
          </Label>
        ) : (
          <Label key={tag} size={'sm'} variantColor={checked ? 'green' : 'gray'} marginRight="1" marginTop="1">
            <Link href="/[query]" as={buildUrl(duration, tag)}>
              <a>{tag}</a>
            </Link>
          </Label>
        );
      })}
      {tags.length > displayLimit && (
        <Label size={'sm'} variantColor="white">
          {'+'} {tags.length - displayLimit} more
        </Label>
      )}
    </>
  );
};

type TagListGroupsProps = {
  tags: Tag[];
  onClick?: (tag: string) => void;
  selected: string | string[];
};

export const TagListGroups: React.FC<TagListGroupsProps> = ({ tags, selected, onClick }) => {
  const multi = Array.isArray(selected);
  const isSelected = (tag: string) => (multi ? selected.indexOf(tag) >= 0 : selected === tag);

  const onChange = (e) => {
    if (onClick) onClick(e.target.value);
  };

  const tagsInGroups: { [key: string]: string[] } = tags.reduce((m, t) => {
    if (!m[t.group]) m[t.group] = [];
    m[t.group].push(t.name);
    return m;
  }, {});

  return (
    <div>
      <style jsx>{`
        .tag {
          border-radius: 3px;
          cursor: pointer;
          background-color: gray;
          display: inline-block;
          margin: 3px;
          padding: 3px 6px;
          font-size: small;
          color: white;
        }

        .tag.active {
          background-color: black;
        }

        .tag > input {
          display: none;
        }

        .tag_group_grid {
          display: grid;
          grid-template-columns: 100px 1fr;
        }
      `}</style>
      {Object.entries(tagsInGroups)
        .filter(([group]) => group)
        .map(([group, tagNames]) => {
          const isAnySelected = !!tagNames.find(isSelected);
          return (
            <div key={group} className={'tag_group_grid'}>
              <h5>{group}</h5>
              <div>
                <label
                  onClick={() => {
                    onChange({ target: { value: tagNames.filter(isSelected) } });
                  }}
                  key={'any'}
                  className={`tag ${!isAnySelected ? 'active' : ''}`}
                >
                  <span>{'any'}</span>
                </label>
                {tagNames.map((tag) => {
                  const checked = isSelected(tag);
                  return (
                    <label key={tag} className={`tag ${checked ? 'active' : ''}`}>
                      <input
                        type={multi ? 'checkbox' : 'radio'}
                        name="tags"
                        onChange={onChange}
                        checked={checked}
                        value={tag}
                      />
                      {tag}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};
