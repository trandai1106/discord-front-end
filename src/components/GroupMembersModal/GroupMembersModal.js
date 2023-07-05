import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faSearch, faUserPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { useState } from 'react';
import { Spin } from 'antd';
import { useCookies } from 'react-cookie';

import styles from './GroupMembersModal.module.scss';
import * as Actions from '../../store/actions/index';
import store from '../../store/store';
// import userAPI from '../../api/userAPI';
// import authAPI from '../../api/authAPI';
import chatRoomAPI from '../../api/chatRoomAPI';

const cx = classNames.bind(styles);
const avatarBaseUrl = process.env.REACT_APP_SERVER_URL;

function GroupMembersModal() {
  const [members, setMembers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [addMember, setAddMember] = useState(false);
  const [isloading, setIsLoading] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const state = store.getState().context.showGroupMembersModal;
  const [adminId, setAdminId] = useState('');
  const [cookies] = useCookies();

  useEffect(() => {
    getMembersInGroup();
    getGroupInfomation();
  }, []);

  const getGroupInfomation = async () => {
    const res = await chatRoomAPI.getRoom(state.groupId);
    setAdminId(res.data.room.admin);
  };

  const getMembersInGroup = async () => {
    setIsLoading(true);
    const res = await chatRoomAPI.getMembers(state.groupId);
    if (res.status) {
      console.log(res);
      setMembers(res.data);
    }
    setIsLoading(false);
  };

  const getPeopleNotInGroup = async () => {
    setIsLoading(true);
    const res = await chatRoomAPI.getPeopleNotInGroup(state.groupId);
    if (res.status) {
      setMembers(res.data);
    }
    console.log(res);
    setIsLoading(false);
  };

  const handleSearchMembersInGroup = async () => {
    setIsLoading(true);
    const res = await chatRoomAPI.searchMembersByName({
      groupId: state.groupId,
      query: searchInput,
    });
    setSearchMode(true);
    setIsLoading(false);
    setMembers(res.data);
  };

  const handleSearchPeopleNotInGroup = async () => {
    setIsLoading(true);
    const res = await chatRoomAPI.searchPeopleNotInGroupByName({
      groupId: state.groupId,
      query: searchInput,
    });
    setSearchMode(true);
    setMembers(res.data);
    setIsLoading(false);
  };

  const toggleAddMember = () => {
    if (!addMember) {
      setAddMember(true);
      getPeopleNotInGroup();
    } else {
      setAddMember(false);
      getMembersInGroup();
    }
  };

  const handleClose = () => {
    store.dispatch(
      Actions.showGroupMembersModal({
        state: false,
        groupId: '',
      }),
    );
  };

  const hanldeShowMemberProfile = (userId) => {
    store.dispatch(
      Actions.showUserProfile({
        state: true,
        userId: userId,
      }),
    );
    store.dispatch(
      Actions.showGroupMembersModal({
        state: false,
        groupId: '',
      }),
    );
  };

  const handleAddMember = async (userId) => {
    const res = await chatRoomAPI.addMember({
      channelId: state.groupId,
      userId: userId,
    });
    console.log(res);
    setMembers(() => {
      return members.filter((member) => member._id !== userId);
    });
  };

  const handleDeleteMember = async (userId) => {
    const res = await chatRoomAPI.deleteMember({
      channelId: state.groupId,
      userId: userId,
    });
    console.log(res);
    setMembers(() => {
      return members.filter((member) => member._id !== userId);
    });
  };

  return (
    <div className={cx('overlay')}>
      <div className={cx('inner')}>
        <div className={cx('container')}>
          <div className={cx('header')}>
            {addMember ? (
              <div className={cx('header__title')}>Add people</div>
            ) : (
              <div className={cx('header__title')}>Group member</div>
            )}
            <div onClick={handleClose} className={cx('close-icon')}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
          <div className={cx('content')}>
            {addMember ? (
              <div className={cx('add-member')}>
                <div className={cx('back-btn')} onClick={toggleAddMember}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Back
                </div>
                <div className={cx('add-member-note')}>
                  New members will be able to see all of message history, including any files that have been shared in
                  the channel. If you'd like, you can create a new channel instead.
                </div>
                <div className={cx('search-container')}>
                  <FontAwesomeIcon icon={faSearch} />
                  <input
                    type="text"
                    placeholder="Find other people"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        handleSearchPeopleNotInGroup();
                      }
                    }}
                  ></input>
                </div>
                {isloading ? (
                  <div className={cx('loading')}>
                    <Spin />
                  </div>
                ) : (
                  <ul className={cx('add-member-list', 'member-list')}>
                    {searchMode && (
                      <div className={cx('search-heading')}>
                        <FontAwesomeIcon
                          className={cx('search-back-icon')}
                          icon={faArrowLeft}
                          onClick={() => {
                            getPeopleNotInGroup();
                            setSearchMode(false);
                          }}
                        />
                        Search results for {searchInput}
                      </div>
                    )}
                    {members.length !== 0
                      ? members.map((members, index) => {
                          return (
                            <li className={cx('add-member-item', 'member-item')} key={members._id}>
                              <div className={cx('add-member-avatar', 'member-avatar')}>
                                <img src={avatarBaseUrl + members.avatar_url} alt="avatar"></img>
                              </div>
                              <div
                                className={cx('add-member-name', 'member-name')}
                                onClick={() => {
                                  hanldeShowMemberProfile(members._id);
                                }}
                              >
                                {members.name}
                              </div>
                              <div className={cx('add-member-add-btn')} onClick={() => handleAddMember(members._id)}>
                                Add
                              </div>
                            </li>
                          );
                        })
                      : ''}
                  </ul>
                )}
              </div>
            ) : (
              <div className={cx('current-members')}>
                <div className={cx('search-container')}>
                  <FontAwesomeIcon icon={faSearch} />
                  <input
                    type="text"
                    placeholder="Find members in group"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        handleSearchMembersInGroup();
                      }
                    }}
                  ></input>
                </div>
                <ul className={cx('member-list')}>
                  {searchMode ? (
                    <div className={cx('search-heading')}>
                      <FontAwesomeIcon
                        className={cx('search-back-icon')}
                        icon={faArrowLeft}
                        onClick={() => {
                          getMembersInGroup();
                          setSearchMode(false);
                        }}
                      />
                      Search results for {searchInput}
                    </div>
                  ) : (
                    <li className={cx('member-item')} onClick={toggleAddMember}>
                      <div className={cx('member-avatar')}>
                        <FontAwesomeIcon icon={faUserPlus} />
                      </div>
                      <div className={cx('member-name')}>Add people</div>
                    </li>
                  )}
                  {members.length !== 0
                    ? members.map((members, index) => {
                        return (
                          <li className={cx('member-item')} key={members._id}>
                            <div className={cx('member-avatar')}>
                              <img src={avatarBaseUrl + members.avatar_url} alt="avatar"></img>
                            </div>
                            <div
                              className={cx('member-name')}
                              onClick={() => {
                                hanldeShowMemberProfile(members._id);
                              }}
                            >
                              {members.name}
                              {adminId === members._id ? ' (admin)' : ''}
                            </div>
                            {cookies.id !== members._id && cookies.id === adminId && (
                              <div className={cx('member-delete')} onClick={() => handleDeleteMember(members._id)}>
                                Delete
                              </div>
                            )}
                          </li>
                        );
                      })
                    : ''}
                </ul>
              </div>
            )}
          </div>
          <div className={cx('footer')}>
            <div className={cx('btn')} onClick={handleClose}>
              Close
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupMembersModal;
