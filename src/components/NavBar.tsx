import { Button } from "@chakra-ui/button";
import { Box, Flex, Link } from "@chakra-ui/layout";
import NextLink from "next/link";
import React from "react";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  if (fetching) {
    // data loading
  } else if (!data?.me) {
    // not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    // logged in
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button variant="link">logout</Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tan" p={4}>
      <Box p={4} ml={"auto"}>
        {body}
      </Box>
    </Flex>
  );
};
