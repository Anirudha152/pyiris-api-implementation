# converts a prompt into arguments
# prompt -> The prompt
# count -> Number of arguements to split into
# split_by -> Split prompt by this string
# replace_empty_with -> If split gives a list with length lesser than <count>, the list is extended by this character.
# index_to_start_from -> Index from which split string should be indexed


def main(prompt, count, split_by=' ', replace_empty_with='', index_to_start_from=1):
    ls = prompt.split(split_by)[index_to_start_from:]
    if len(ls) < count:
        ls.extend([replace_empty_with for i in range(count - len(ls))])
    elif len(ls) > count:
        ls1 = ls[:count-1]
        ls1.append(' '.join(ls[count-1:]))
        ls = ls1
    return tuple(ls)