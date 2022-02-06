import { Box, Flex, Link, Stack } from "@chakra-ui/layout";
import { Button, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpbootSection } from "../components/UpbootSection";
import { usePostsQuery, PostsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    // for loading indicator on load more button
    notifyOnNetworkStatusChange: true,
  });
  // console.log(loading, other);

  if (!loading && !data) {
    return (
      <div>
        <div>query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }
  return (
    <Layout>
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            // deleted posts are set to null so need to account for null values in data.posts.posts
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpbootSection post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>posted by {p.creator.username}</Text>
                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {p.textSnippet}
                    </Text>
                    <Box ml="auto">
                      <EditDeletePostButtons
                        id={p.id}
                        creatorId={p.creator.id}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  // cursor is a createdAt field from posts
                  // setting it to last elements on the list
                  // get all elements after the last element
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                updateQuery: (
                  previousValue,
                  { fetchMoreResult }
                ): PostsQuery => {
                  if (!fetchMoreResult) {
                    return previousValue as PostsQuery;
                  }
                  return {
                    __typename: "Query",
                    posts: {
                      __typename: "PaginatedPosts",
                      hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                      posts: [
                        ...(previousValue as PostsQuery).posts.posts,
                        ...(fetchMoreResult as PostsQuery).posts.posts,
                      ],
                    },
                  };
                },
              });
            }}
            isLoading={loading}
            m="auto"
            my={8}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

// add ssr if doing a query on the page
// and if that query is important to seo
export default withApollo({ ssr: true })(Index);
